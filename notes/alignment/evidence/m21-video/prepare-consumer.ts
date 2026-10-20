const dir='/tmp/acme-m21-video';
let candidate=await Bun.file(dir+'/candidate-compiled.ts').text();
candidate=candidate.replace("'/Users/peterkloss/Dev/ACMElabs/design-system/dist/components/video/video.js'","'@acmelabs/design-system/components/video'");
await Bun.write(dir+'/consumer/main.ts',candidate);
let runner=await Bun.file(dir+'/run-compiled.ts').text();
runner=runner.replace("dir+'/candidate-compiled.ts'","dir+'/consumer/main.ts'").replaceAll("dir+'/bundle'","dir+'/consumer/out'").replaceAll("/candidate-compiled.js","/main.js").replace("root+'/src/generated/css/document/tokens.css'","dir+'/consumer/node_modules/@acmelabs/design-system/dist/styles/tokens.css'").replace("'/compiled-results.json'","'/consumer-results.json'");
await Bun.write(dir+'/consumer-check.ts',runner);
