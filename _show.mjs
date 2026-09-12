import { chromium } from '@playwright/test';
const b = await chromium.launch({ headless:false, slowMo:120, args:['--window-size=1500,1000','--window-position=40,40'] });
const page = await b.newPage({ viewport:{width:1440,height:900} });
await page.goto('http://localhost:3000/website/box-demo');
await page.evaluate(()=>{
  const blk=(id,c,t)=>({id,type:'container',layout:'flex',direction:'column',width:'100%',padding:16,gap:0,
    background:c,children:[{id:id+'t',type:'text',text:t,width:'100%'}]});
  const label=(id,t)=>({id,type:'heading',text:t,width:'100%',fontSize:20,bold:true});
  const band=(id,kids)=>({id,type:'container',direction:'row',rowBand:true,width:'fill',gap:0,padding:0,children:kids});
  const site={pages:[{id:'p1',name:'Home',path:'/',root:{id:'root',type:'container',direction:'column',padding:0,gap:0,children:[
    band('b1',[label('l1','1 · SECTION  —  a box that stacks things DOWN')]),
    band('b2',[{id:'sec',type:'container',layout:'flex',direction:'column',width:'100%',padding:0,gap:8,
      children:[blk('s1','#c7d2fe','first'),blk('s2','#bbf7d0','second'),blk('s3','#fde68a','third')]}]),
    band('b3',[label('l2','2 · ROW  —  the same box, turned SIDEWAYS')]),
    band('b4',[{id:'row',type:'container',layout:'flex',direction:'row',wrap:true,width:'100%',padding:0,gap:8,
      children:[blk('r1','#c7d2fe','first'),blk('r2','#bbf7d0','second'),blk('r3','#fde68a','third')]}]),
    band('b5',[label('l3','3 · COLUMNS  —  the same box again, cut into TWELVE')]),
    band('b6',[{id:'grid',type:'container',layout:'grid',columns:12,width:'100%',padding:0,gap:8,children:[
      Object.assign(blk('g1','#c7d2fe','span 6'),{colSpan:6}),
      Object.assign(blk('g2','#bbf7d0','span 3'),{colSpan:3}),
      Object.assign(blk('g3','#fde68a','span 3'),{colSpan:3})]}]),
  ]}}],homeId:'p1'};
  localStorage.setItem('educo_box_site_v1',JSON.stringify(site));
  localStorage.setItem('educo_box_site_cleaned_v1','1');
});
await page.reload(); await page.waitForTimeout(3000);
await page.screenshot({ path:'uat-three-tiles.png' });
console.log('screenshot saved — browser stays open 45s so you can look');
await page.waitForTimeout(45000);
await b.close();
