const fs = require('fs'); const path = require('path');
const weightedPick = require('../../src/util/weightedPick');
const makeAttachment = require('../../src/util/makeAttachmentArray');

const noes = [
  {
    filename: "gotarock.gif", weight: 1,
    text: "It's not Halloween, but here's a rock anyway"
  },{
    filename: "scooby-no.gif", weight: 1,
    text: "It is NOT Halloween!"
  },{
    filename: "skele-hungry.gif", weight: .5,
    text: "It's not Halloween! Get eaten!"
  },{
    filename: "skele-hungry.mp4", weight: .1,
    text: "Nope! G'bye!"
  }
];
let totalNoWeight = 0;
noes.forEach(no => totalNoWeight += no.weight);


const davidPumps = getFilesByName("dsp","gif");

const pumpDances = getFilesByName("pump-dance","gif");
const pumpDanceVid = "pump-dance.mp4";

const pusheens = getFilesByName("push-","gif");

const skel3Ds = getFilesByName("skel3d-","gif");

const melt = "skele-melt.gif";

const ghost = "ghost1.gif";


// just so I don't have to type out a bunch of filenames
function getFilesByName (name, exten="gif") {
  const fileArray = fs.readdirSync(path.resolve(__dirname, '../../assets/halloween'))
    .filter(filename => filename.startsWith(name))
    .filter(filename => filename.endsWith('.'+exten));
  return fileArray;
}

// get a random filename from an array of names
function getRandomFilename(files) {
  const filename = files[Math.floor(Math.random() * files.length)];
  return filename;
}

// choose a random file and send it
function yesReply() {
  const yesPick = weightedPick([
    {weight: .20, filename: getRandomFilename(davidPumps)},
    {weight: .28, filename: getRandomFilename(pumpDances)},
    {weight: .02, filename: pumpDanceVid},
    {weight: .15, filename: getRandomFilename(pusheens)},
    {weight: .15, filename: getRandomFilename(skel3Ds)},
    {weight: .15, filename: melt},
    {weight: .15, filename: ghost}
  ], 1);
  return {content: "It IS Halloween!!", files: [yesPick.filename]}
}


// send a negative response from the noes array
async function noReply() {
  const noPick = weightedPick(noes, totalNoWeight);
  return {content: noPick.text, files: [noPick.filename]};
}


module.exports = async (message) => {
  const date = message.createdAt;
  let replyPayload = { content: '', files: [] };

  if (
    // if it's september 1 - november 30, it's halloween
    ( date.getMonth() > 7 && date.getMonth() < 11 ) ||
    // if it's july "15" - august 31 or december 1 - january "15", it might be halloween
    ( (date.getMonth() > 5 || date.getMonth() < 1) && Math.random() > .420 ) ||
    // for the rest of the year, it's less likely to be halloween
    ( Math.random() < .31 )
  ) {
    replyPayload = await yesReply();
  }
  // if it's not halloween, well....
  else replyPayload = await noReply();

  replyPayload.files = await makeAttachment(replyPayload.files, './assets/halloween/');
  await message.reply(replyPayload);
}
