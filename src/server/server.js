const Express = require("express");
const Fs = require("fs");
const Config = require("./config");

const app = Express();
app.use(Express.json());

app.get('/api/current', async (request, response) =>
{
    const list = await LoadCurrent();
    response.send(list);
});

app.post('/api/current', (request, response) =>
{
    // TODO: I should probably check that the data is correct and that the save worked
    SaveCurrent(request.body);
    response.sendStatus(200);
});

app.use('/', Express.static(global.Config.WwwRoot));

app.listen(global.Config.HttpPort, () =>
{
    console.log(`Challenge.js server listening on port ${global.Config.HttpPort}`);
})

function LoadCurrent()
{
    return new Promise((resolve, reject) => 
    {
        Fs.readFile(global.Config.CurrentFile, (error, data) =>
        {
            if (error)
            {
                resolve (
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
                    ]);
                return;
            }
            resolve (JSON.parse(data));
        });
    });
}

function SaveCurrent(list)
{
    Fs.writeFile(global.Config.CurrentFile, JSON.stringify(list), (error) =>
    {
        if (error)
        {
            return console.log (error);
        }
        console.log(`Wrote ${global.Config.CurrentFile}.`);
    });
}