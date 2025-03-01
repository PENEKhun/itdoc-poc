import { fileURLToPath } from 'url';
import path from 'path';
import Mocha from 'mocha';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testTarget = path.resolve(__dirname, 'expressApp.usecase.js');

const mocha = new Mocha();
mocha.addFile(testTarget);

mocha.run()
  .on('test', function(test) {
    // console.log('Test started: '+test.title);
  })
  .on('test end', function(test) {
    console.log('Test done: '+test.title);
  })
  .on('pass', function(test) {
    // console.log('Test passed');
    // console.log(test);
  })
  .on('fail', function(test, err) {
    // console.log('Test fail');
    // console.log(test);
    // console.log(err);
  })
  .on('end', function() {
    // console.log('All done');
  });
