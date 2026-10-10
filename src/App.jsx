import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Building2, Check, ChevronLeft, ChevronRight, Compass, Droplets, Menu, Pause, Play, ShieldCheck, Sparkles, X } from 'lucide-react';
import Campus from './Campus.jsx';
import { site, tourOrder } from './data.js';

function IconMark({children}) { return <span className="icon-mark">{children}</span>; }
function Header({onEnquire}) {
 const [menuOpen,setMenuOpen]=useState(false);
 const links=[['Campus','#campus'],['Services','#services'],['Alpha Doors','#alpha'],['About','#about'],['Partners','#partners'],['Contact','#contact']];
 return <header className="nav-shell"><a className="brand" href="#top" aria-label="DRFCO home"><span className="brand-symbol">D<span>R</span></span><span className="brand-name">DRFCO <small>HOLDING</small></span></a>
 <button className="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen?<X/>:<Menu/>}</button>
 <nav className={menuOpen?'nav-links open':'nav-links'}>{links.map(([t,h])=><a key={t} href={h} onClick={()=>setMenuOpen(false)}>{t}</a>)}<button className="nav-cta" onClick={onEnquire}>Enquire <ArrowUpRight size={15}/></button></nav></header>;
}
function ServicePanel({item,onClose,onQuote}) {
 if(!item)return null;
 return <aside className="service-panel" style={{'--accent':item.accent}} role="dialog" aria-modal="true" aria-labelledby="panel-title">
   <div className="panel-top"><span className="eyebrow">CAMPUS DIRECTORY / {String(site.services.findIndex(s=>s.id===item.id)+1).padStart(2,'0')}</span><button className="icon-button" onClick={onClose} aria-label="Close service details"><X size={19}/></button></div>
   <div className="panel-symbol">{item.icon}</div><h2 id="panel-title">{item.name}</h2><p className="panel-lede">{item.description}</p>
   <div className="panel-rule"/><span className="eyebrow">CAPABILITIES</span><ul className="offering-list">{item.offerings.map(o=><li key={o}><Check size={15}/>{o}</li>)}</ul>
   <button className="button button-primary panel-quote" onClick={()=>onQuote(item.name)}>Request a Quote <ArrowRight size={16}/></button>
 </aside>;
}
function TourControls({index,playing,onPause,onPrev,onNext,onExit}) {
 const item=site.services.find(s=>s.id===tourOrder[index]);
 return <div className="tour-controls">
   <div className="tour-status"><span className="live-dot"/><span className="eyebrow">CINEMATIC TOUR</span><b>{index+1} <i>/</i> {tourOrder.length}</b></div>
   <div className="tour-track"><span style={{width:`${((index+1)/tourOrder.length)*100}%`}}/></div>
   <div className="tour-caption"><span className="tour-caption-icon">{item?.icon}</span><div><b>{item?.name}</b><small>{item?.caption}</small></div></div>
   <div className="tour-actions"><button onClick={onPrev} aria-label="Previous stop"><ChevronLeft/></button><button className="tour-play" onClick={onPause} aria-label={playing?'Pause tour':'Resume tour'}>{playing?<Pause size={16}/>:<Play size={16}/>}</button><button onClick={onNext} aria-label="Next stop"><ChevronRight/></button><button className="tour-exit" onClick={onExit}>Exit tour <X size={14}/></button></div>
 </div>;
}
function CallbackForm({initialSubject=''}) {
 const [form,setForm]=useState({name:'',email:'',phone:'',subject:initialSubject||''});
 const [sent,setSent]=useState(false); const [error,setError]=useState('');
 useEffect(()=>{if(initialSubject)setForm(f=>({...f,subject:initialSubject}))},[initialSubject]);
 const update=(e)=>setForm({...form,[e.target.name]:e.target.value});
 const submit=(e)=>{e.preventDefault();if(!form.name.trim()||!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)||!form.phone.trim()||!form.subject){setError('Please complete all fields with a valid email address.');return}setError('');setSent(true)};
 if(sent)return <div className="success-state"><span className="success-icon"><Check/></span><h3>Thank you for reaching out.</h3><p>Your request has been captured in this demo. Connect the form to your CRM or backend to receive real enquiries.</p><button className="button button-outline" onClick={()=>{setSent(false);setForm({name:'',email:'',phone:'',subject:''})}}>Send another request</button></div>;
 return <form className="callback-form" onSubmit={submit} noValidate>
  <div className="form-row"><label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" required/></label><label>Email address<input name="email" value={form.email} onChange={update} placeholder="you@company.com" type="email" autoComplete="email" required/></label></div>
  <div className="form-row"><label>Phone number<input name="phone" value={form.phone} onChange={update} placeholder="+971 ..." type="tel" autoComplete="tel" required/></label><label>I'm interested in<select name="subject" value={form.subject} onChange={update} required><option value="">Select a service</option>{site.services.filter(s=>s.id!=='hq').map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select></label></div>
  {error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-primary form-submit" type="submit">Request a call back <ArrowRight size={16}/></button><p className="form-note">By submitting, you agree to be contacted about your enquiry.</p>
 </form>;
}
export default function App(){
 const [selected,setSelected]=useState(null),[tourIndex,setTourIndex]=useState(0),[tourPlaying,setTourPlaying]=useState(false),[tourActive,setTourActive]=useState(false),[reduceMotion,setReduceMotion]=useState(false),[formSubject,setFormSubject]=useState(''),[intro,setIntro]=useState(true);
 const heroRef=useRef(null),aboutRef=useRef(null);
 const selectedItem=site.services.find(s=>s.id===selected);
 const tourTarget=tourActive?site.services.find(s=>s.id===tourOrder[tourIndex]):null;
 const [webglFallback,setWebglFallback]=useState(false);
 useEffect(()=>{const t=setTimeout(()=>setIntro(false),1150);return()=>clearTimeout(t)},[]);
 useEffect(()=>{const handler=(e)=>{if(e.key==='Escape'){setSelected(null);setTourActive(false);setTourPlaying(false)}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[]);
 useEffect(()=>{if(!tourActive||!tourPlaying||reduceMotion)return;const t=setTimeout(()=>setTourIndex(i=>(i+1)%tourOrder.length),7200);return()=>clearTimeout(t)},[tourActive,tourPlaying,tourIndex,reduceMotion]);
 useEffect(()=>{if(!reduceMotion){gsap.fromTo('.reveal',{y:24,opacity:0},{y:0,opacity:1,duration:.8,stagger:.08,ease:'power3.out',scrollTrigger:undefined})}},[reduceMotion]);
 const beginTour=()=>{setSelected(null);setTourIndex(0);setTourActive(true);setTourPlaying(true);document.getElementById('campus')?.scrollIntoView({behavior:reduceMotion?'auto':'smooth'})};
 const stopTour=()=>{setTourActive(false);setTourPlaying(false)};
 const goStop=(delta)=>setTourIndex(i=>(i+delta+tourOrder.length)%tourOrder.length);
 const openQuote=(subject='')=>{setFormSubject(subject);setSelected(null);stopTour();document.getElementById('contact')?.scrollIntoView({behavior:reduceMotion?'auto':'smooth'})};
 return <div id="top" className={reduceMotion?'app reduce-motion':'app'}>
  {intro&&<div className="intro-screen"><div className="intro-logo">DRFCO<span> HOLDING</span></div><div className="intro-line"><i/></div><p>ENGINEERING ENDURANCE SINCE 1978</p></div>}
  <Header onEnquire={()=>openQuote()}/>
  <main>
   <section className="hero" id="campus" ref={heroRef}>
    <div className="hero-backdrop"/><div className="hero-copy">
      <div className="hero-kicker reveal"><span className="kicker-line"/>{site.claim}</div>
      <h1 className="reveal">A legacy of<br/><em>lasting</em> strength.</h1>
      <p className="hero-sub reveal">{site.tagline}</p><p className="hero-cert reveal"><ShieldCheck size={15}/>{site.standards}</p>
      <div className="hero-actions reveal"><button className="button button-primary" onClick={beginTour}><Play size={15} fill="currentColor"/> Start Tour</button><button className="button button-glass" onClick={()=>{setSelected(null);stopTour();document.querySelector('.scene-hint')?.scrollIntoView({block:'nearest',behavior:'smooth'})}}><Compass size={16}/> Explore Campus</button></div>
      <div className="hero-meta reveal"><span>25°12' N — 55°16' E</span><span className="meta-divider"/><span>UNITED ARAB EMIRATES</span></div>
    </div>
    <div className="hero-side-note">BUILT ON TRUST <span>—</span> PROVEN OVER TIME</div>
    <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={17}/></div>
    <div className="campus-wrap"><Campus selected={selected} onSelect={(id)=>{setSelected(id);stopTour()}} reduceMotion={reduceMotion} tourTarget={tourPlaying?tourTarget:null} webglFallback={webglFallback}/></div>
    {tourActive&&<TourControls index={tourIndex} playing={tourPlaying} onPause={()=>setTourPlaying(!tourPlaying)} onPrev={()=>goStop(-1)} onNext={()=>goStop(1)} onExit={stopTour}/>}
    <div className="hero-bottom-note"><span className="pulse"/> IMMERSIVE CAMPUS EXPERIENCE <span>01 / 07</span></div>
    <ServicePanel item={selectedItem} onClose={()=>setSelected(null)} onQuote={openQuote}/>
    <div className="motion-toggle"><label><input type="checkbox" checked={reduceMotion} onChange={e=>setReduceMotion(e.target.checked)}/> Reduce motion</label></div>
   </section>
   <section className="intro-strip"><span className="eyebrow">DRFCO HOLDING / UAE</span><p>We bring people, places and performance together — <em>with confidence that lasts.</em></p><span className="strip-index">EST. 1978</span></section>
   <section className="section about-section" id="about">
    <div className="section-heading reveal"><span className="eyebrow">01 — WHY DRFCO</span><h2>Built on experience.<br/><em>Driven by possibility.</em></h2></div>
    <div className="about-grid"><div className="about-copy reveal"><p className="large-copy">{site.about}</p><p>From below-ground protection to the spaces we work in every day, our teams combine practical expertise with a commitment to quality, safety and long-term value.</p><a className="text-link" href="#services">Discover our capabilities <ArrowUpRight size={16}/></a></div>
     <div className="about-visual reveal"><div className="orb orb-one"/><div className="orb orb-two"/><div className="about-visual-content"><span className="eyebrow">OUR FOUNDATION</span><strong>47<span>+</span></strong><p>years of building<br/>confidence across the UAE</p><div className="visual-coordinate">25.2048° N&nbsp; / &nbsp;55.2708° E</div></div><div className="visual-corner">DRFCO / 1978</div></div>
    </div>
    <div className="domain-row">{[['01','Waterproofing','Protection that performs.'],['02','Facilities Management','Spaces that work smarter.'],['03','Interior Expertise','Design with purpose.'],['04','Manufacturing','Precision in every detail.']].map(([n,t,d])=><div className="domain-card reveal" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><ArrowUpRight size={17}/></div>)}</div>
   </section>
   <section className="section services-section" id="services">
    <div className="section-heading reveal"><span className="eyebrow">02 — WHAT WE DO</span><h2>Solutions for the<br/><em>built environment.</em></h2><p>Specialist knowledge. Proven systems. Performance that stands the test of time.</p></div>
    <div className="feature-services">
      <article className="feature-card waterproof reveal"><div className="feature-art art-water"><div className="art-ring"/><Droplets size={70} strokeWidth={.8}/><span>WATER / PROTECTION</span></div><div className="feature-content"><span className="eyebrow">01 / WATERPROOFING</span><h3>Empowering through<br/><em>Waterproofing.</em></h3><p>Expert waterproofing solutions engineered for the UAE's demanding climate, helping protect structures from the ground up.</p><ul><li>Substructural waterproofing</li><li>Integrated protection systems</li><li>Long-term performance</li></ul><button className="text-link" onClick={()=>setSelected('waterproofing')}>Explore service <ArrowUpRight size={16}/></button></div></article>
      <article className="feature-card flooring reveal"><div className="feature-art art-floor"><div className="floor-grid"/><span>FORM / FUNCTION</span></div><div className="feature-content"><span className="eyebrow">02 / FLOORING</span><h3>Crafting enchantment<br/><em>with Flooring.</em></h3><p>From timeless elegance to modern charisma, flooring solutions designed to unite beauty, function and durability.</p><ul><li>Commercial and industrial spaces</li><li>Carefully considered finishes</li><li>Function with lasting style</li></ul><button className="text-link" onClick={()=>setSelected('flooring')}>Explore service <ArrowUpRight size={16}/></button></div></article>
    </div>
    <div className="trust-band reveal"><Sparkles size={21}/><p><b>Your Trusted Partner.</b> A proven track record, skilled teams and a commitment to solutions that last.</p><span>DRFCO / UAE</span></div>
   </section>
   <section className="alpha-section" id="alpha"><div className="alpha-bg-grid"/><div className="section alpha-inner"><div className="alpha-head reveal"><span className="eyebrow">03 — ALPHA SECURITY & ALLIED SYSTEMS</span><h2>Access engineered.<br/><em>Security assured.</em></h2><p>Doors & Security Products — dependable systems for every threshold, opening and loading bay.</p><div className="alpha-actions"><button className="button button-primary" onClick={()=>setSelected('alpha')}>Explore Alpha Doors <ArrowRight size={16}/></button><span>DESIGNED FOR DEMAND / BUILT FOR DAILY USE</span></div></div><div className="alpha-product-area"><div className="alpha-product-top"><span className="eyebrow">PRODUCT PORTFOLIO</span><span>15 CATEGORIES</span></div><div className="product-grid">{site.alphaProducts.map((p,i)=><button className="product-tile reveal" key={p} onClick={()=>setSelected('alpha')}><span className="product-number">{String(i+1).padStart(2,'0')}</span><span>{p}</span><ArrowUpRight size={15}/></button>)}</div><div className="mission-vision"><div><span className="eyebrow">OUR MISSION</span><p>Deliver dependable, well-engineered door and security products that support safer, smoother operations.</p></div><div><span className="eyebrow">OUR VISION</span><p>Be a trusted partner for access and security solutions across the region through quality and innovation.</p></div></div></div></div></section>
   <section className="numbers-section"><div className="numbers-heading reveal"><span className="eyebrow">04 — THE NUMBERS</span><h2>Experience you can<br/><em>build on.</em></h2></div><div className="counter-grid">{site.counters.map(([n,t],i)=><div className="counter reveal" key={t}><span className="counter-index">0{i+1}</span><strong>{n}</strong><p>{t}</p><div className="counter-line"/></div>)}</div></section>
   <section className="partners-section section" id="partners"><div className="partners-heading reveal"><div><span className="eyebrow">05 — PARTNERS IN PERFORMANCE</span><h2>Strong systems start<br/>with <em>strong partners.</em></h2></div><p>Working with established names in materials and technology to deliver dependable results.</p></div><div className="partner-marquee"><div className="partner-track">{[...site.partners,...site.partners].map((p,i)=><div className="partner-logo" key={`${p}-${i}`}><span>{p}</span><i/></div>)}</div></div><p className="partner-note">Selected partner and supplier names. Add approved brand logos in place of text wordmarks.</p></section>
   <section className="contact-section" id="contact"><div className="contact-glow"/><div className="section contact-grid"><div className="contact-copy reveal"><span className="eyebrow">06 — LET'S BUILD SOMETHING LASTING</span><h2>Tell us what<br/>you're <em>building.</em></h2><p>Have a project in mind or need specialist advice? Share a few details and our team can follow up.</p><div className="contact-direct"><span className="contact-icon"><Building2 size={19}/></span><div><small>GENERAL ENQUIRIES</small><a href="tel:+97143331003">+971 04 333 1003</a><a href="mailto:info@drfco.com">info@drfco.com</a></div></div></div><div className="contact-form-wrap reveal"><div className="form-head"><span className="eyebrow">REQUEST A CALL BACK</span><span>RESPONSE STARTS HERE ↗</span></div><CallbackForm initialSubject={formSubject}/></div></div></section>
  </main>
  <footer className="footer"><div className="footer-main"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-symbol">D<span>R</span></span><span className="brand-name">DRFCO <small>HOLDING</small></span></a><p>Built to endure.<br/>Designed to perform.</p><div className="socials"><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a></div></div><div className="footer-offices">{site.offices.map(o=><div className="office" key={o.name}><span className="eyebrow">{o.name.toUpperCase()}</span><p>{o.address}</p><a href={`tel:${o.phone.replaceAll(' ','')}`}>{o.phone}</a></div>)}</div></div><div className="footer-bottom"><span>Copyright © 2026 Desert Roofing & Flooring L.L.C</span><span>UNITED ARAB EMIRATES <i>•</i> BUILT ON TRUST</span><a href="#top">BACK TO TOP ↑</a></div></footer>
 </div>;
}