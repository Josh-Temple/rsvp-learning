import fs from "node:fs";import path from "node:path";
const root=process.cwd(),out=path.join(root,"dist-pages"),base="/rsvp-learning/";
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const file of ["index.html","app.js","styles.css","manifest.webmanifest","sw.js","icon.svg"])fs.copyFileSync(path.join(root,file),path.join(out,file));
for(const dir of ["courses","lessons","learn","listen"])fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
const mp=path.join(out,"manifest.webmanifest"),m=JSON.parse(fs.readFileSync(mp,"utf8"));m.id=base;m.start_url=base;m.scope=base;for(const icon of m.icons||[])if(icon.src?.startsWith("/"))icon.src=base+icon.src.slice(1);fs.writeFileSync(mp,JSON.stringify(m,null,2)+"\n");
const sp=path.join(out,"sw.js");let sw=fs.readFileSync(sp,"utf8");sw=sw.replaceAll('"/','"'+base).replaceAll("'/'","'"+base);fs.writeFileSync(sp,sw);fs.writeFileSync(path.join(out,".nojekyll"),"");console.log("Built",out);