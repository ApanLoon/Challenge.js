const Express = require("express");
const Sqlite3 = require("sqlite3").verbose();
const Config = require("./config");

const webServer = Express();
webServer.use(Express.json());

webServer.get('/api/current', async (request, response) =>
{
    try
    {
        const list = await LoadCurrent();
        response.send(list);    
    }
    catch (error)
    {
        Log(error);
        response.sendStatus(500, error);
    }
});

webServer.post('/api/current', async (request, response) =>
{
    try
    {
        // TODO: I should probably check that the data is correct
        await SaveIconSet(request.body, false);
        response.sendStatus(200);
    }
    catch (error)
    {
        Log(error);
        response.sendStatus(500);
    }
});

webServer.use('/', Express.static(global.Config.WwwRoot));

var database;
OpenDatabase()
    .then(() => CreateTable())
    .then(() => 
    {
        webServer.listen(global.Config.HttpPort, () =>
        {
            Log(`Challenge.js server listening on port ${global.Config.HttpPort}`);
        });
    })
    .catch(error => Log("APA: " + error));

////////////////////////////////////
// Functions:

function OpenDatabase()
{
    return new Promise((resolve, reject) =>
    {
        database = new Sqlite3.Database (global.Config.DbFile, error => error ? reject(error) : resolve());
    });
}

function CreateTable()
{
    return new Promise ((resolve, reject) =>
    {
        Log("Connected to database.");
        database.run(
            'CREATE TABLE IF NOT EXISTS IconSets (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INTEGER, isDefault INTEGER, iconSet TEXT)',
            error => error ? reject(error) : resolve()
        );
    }); 
}

function LoadCurrent()
{
    return new Promise((resolve, reject) => 
    {
        database.get("SELECT * FROM IconSets WHERE id = (SELECT MAX(id) FROM IconSets)", async (error, row) =>
        {
            if (error)
            {
                Log (error.message);
                reject(error.message);
            }
            if (row)
            {
                resolve(JSON.parse(row.iconSet));
            }
            else
            {
                Log("Creating initial IconSet.")
                let iconSet = 
                [
                    {"image":"CokeCan.png","x":2.188700384122919,"y":16.447456942949408,"angle":"0"},
                    {"image":"CokeCan.png","x":94.49023687580025,"y":17.3085979547901,"angle":"0"},
                    {"image":"CokeCan.png","x":87.24191741357234,"y":17.68702906350915,"angle":"0"},
                    {"image":"CokeCan.png","x":81.50708226632523,"y":37.20902852529602,"angle":"0"},
                    {"image":"CokeCan.png","x":81.47207106274007,"y":17.416240581270184,"angle":"0"},
                    {"image":"CokeCan.png","x":67.66865396927017,"y":36.75154736275565,"angle":"0"},
                    {"image":"CokeCan.png","x":73.83462708066581,"y":17.174044671689987,"angle":"0"},
                    {"image":"CokeCan.png","x":67.57962548015365,"y":16.770384822389666,"angle":"0"},
                    {"image":"CokeCan.png","x":54.8095390524968,"y":36.69772604951561,"angle":"0"},
                    {"image":"CokeCan.png","x":60.60439340588989,"y":17.081539289558666,"angle":"0"},
                    {"image":"CokeCan.png","x":54.07130281690141,"y":17.3085979547901,"angle":"0"},
                    {"image":"CokeCan.png","x":42.2515204865557,"y":36.20997039827772,"angle":"0"},
                    {"image":"CokeCan.png","x":47.85331306017926,"y":17.382602260495155,"angle":"0"},
                    {"image":"CokeCan.png","x":41.77936939820743,"y":17.200955328310013,"angle":"0"},
                    {"image":"CokeCan.png","x":28.39808738796415,"y":16.639195371367062,"angle":"0"},
                    {"image":"CokeCan.png","x":21.51088348271447,"y":16.64760495156082,"angle":"0"},
                    {"image":"CokeCan.png","x":15.114836747759282,"y":16.73842841765339,"angle":"0"},
                    {"image":"CokeCan.png","x":2.1576904609475034,"y":36.51271528525296,"angle":"0"},
                    {"image":"CokeCan.png","x":7.86651728553137,"y":16.497914424111947,"angle":"0"}
                ];

                try
                {
                    await SaveIconSet(iconSet, true, true); // Save the default set
                    await SaveIconSet(iconSet, true, false); // Save the first period
                    resolve(iconSet);
                }
                catch(error)
                {
                    reject(error);
                }
            }
        })
    });
}

function SaveIconSet (iconSet, isNew, isDefault)
{
    return new Promise((resolve, reject) => 
    {
        if (isNew)
        {
            database.run("INSERT INTO IconSets (timestamp, isDefault, iconSet) VALUES (strftime('%s', 'now'), ?, ?)", isDefault ? 1 : 0, JSON.stringify(iconSet), (error) =>
            {
                if (error)
                {
                    reject (error.message);
                }
                else
                {
                    Log("Saved new icon set.");
                    resolve();
                }
            });    
        }
        else
        {
            database.run("UPDATE IconSets SET timestamp = strftime('%s', 'now'), isDefault = ?, iconSet = ? WHERE id in (SELECT id FROM IconSets ORDER BY id DESC LIMIT 1)", isDefault ? 1 : 0, JSON.stringify(iconSet), (error) =>
            {
                if (error)
                {
                    reject (error.message);
                }
                else
                {
                    Log("Updated icon set.");
                    resolve();
                }
            });    
        }
    });
}

function Log(message)
{
    const date_ob = new Date();
    const date = IntTwoChars(date_ob.getDate());
    const month = IntTwoChars(date_ob.getMonth() + 1);
    const year = date_ob.getFullYear();
    const hours = IntTwoChars(date_ob.getHours());
    const minutes = IntTwoChars(date_ob.getMinutes());
    const seconds = IntTwoChars(date_ob.getSeconds());
    const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    console.log(`${timestamp} ${message}`);
}

function IntTwoChars(i)
{
    return (`0${i}`).slice(-2);
}