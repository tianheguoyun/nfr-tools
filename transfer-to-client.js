// 从Excel中读取用户ID，源地址和目标地址，以及NFR ID
// 调用天河链的接口实现用户信息转移
// node transfer-to-client.js <env> <filename> <sheetName> [startLine] [endLine]
// Excel文件必须按以下顺序: 合约地址,NFR ID,源地址,期望转移地址,用户ID，用户密码

const async = require("async");
const fs = require("fs");
const https =require('https');
var XLSX = require("xlsx");



var config = require("./config.json")[process.argv[2]]


function usage(){
    console.log("node transfer-to-client.js <env> <filename> <sheetName> [startLine] [endLine]");
    console.log("    env   run environment write in config.json file.");
    console.log("    filename   Excel file");
    console.log("    sheetName  Sheet name");
    console.log("    startLine Excel start, default to 1, 0 for first line in Excel");
    console.log("    startLine Excel start, default to 1, 0 for first line in Excel");
    process.exit();
}


if (!config){
    console.log("No environment configure load.");
    usage();
}

if (process.argv.length < 5){
    console.log("No enough parameters for execution.");
    usage();
}

var filename = process.argv[3];
var sheetName = process.argv[4];

if (!filename || !fs.existsSync(filename)){
    console.log("File ", filename , " not exist.");
    usage();
}

if (!filename || !fs.existsSync(filename)){
    console.log("File ", filename , " not exist.");
    usage();
}



var appId = config.appId;
var appKey = config.appKey;
function excel_to_object(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
        if(roa.length) result[sheetName] = roa;
    });
    return result;
};

var opts = {};
var workbook = XLSX.readFile(filename, opts);

var excelData = excel_to_object(workbook)[sheetName];
var startLine = process.argv[5] || 1
var endLine = process.argv[6] || (excelData.length - 1);
var i = startLine;
async.whilst(
    function(cb){cb(null, i <= endLine);},
    function(cb){
        var userId = excelData[i][4]
        var userKey = excelData[i][5]
        var fromAddress = excelData[i][2]
        var toAddress = excelData[i][3]
        var nfrId = excelData[i][1]
        var nfrContractAddress = excelData[i][0];
        postData = {
            "appId":appId,
            "appKey":appKey,
            "userId":userId, 
            "userKey":userKey, 
            "contractAddress":nfrContractAddress,
            "tokenId":nfrId,
            "from":fromAddress,
            "to":toAddress
        };
        var postString = JSON.stringify(postData)
        const options = {
            hostname:config.host || "api.tichain.tianhecloud.com", port:443, path: '/api/v2/nfr/transfer', method:'POST', 
            headers:{'Content-Type':'application/json', 'Content-Length':Buffer.byteLength(postString)}
        }
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
                res.on('data', (chunk) => {
                var resp = JSON.parse(chunk);
                if (resp.code == 0 && resp.data){
                    console.log(i + "\t" + resp.data.transactionHash)
                }
            });
            res.on('end', ()=>{i++; cb()});
        });
        req.on('error', (e) => {console.error(e);});
        req.write(postString);
        req.end();
    }, function(error){
        if (error){
            console.log(error);
        }else{
            console.log('Done');
        }
    }
);