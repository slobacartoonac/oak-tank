var fs = require('fs');

//fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'));
fs.readdir('./data', (err, files) => {
  files.forEach(file => {
    console.log(file);
	var file2=file.split('.')[0]+'.txt'
	if(file.split('.')[1]=='json')
		fs.createReadStream('./data/'+file).pipe(fs.createWriteStream('./data/'+file2));
  });
})