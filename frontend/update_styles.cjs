const fs = require('fs');
const path = './src/App.jsx';

let code = fs.readFileSync(path, 'utf8');

// 1. "PERPETUAL KYC TIMELINE", "RBI DIGITAL PAYMENTS...", "NATIONAL INTELLIGENCE...", "UPI RISK INDICATORS", "TOP CONTRIBUTING FACTORS", "VISUAL PATTERN ANALYSIS", "RISK FACTOR SUMMARY"
// Replace font-size: 9px/10px, font-weight: 600, color: var(--t2)/riskColor, etc.

const headers = [
  "PERPETUAL KYC TIMELINE",
  "RBI DIGITAL PAYMENTS INTELLIGENCE PLATFORM",
  "NATIONAL INTELLIGENCE SIGNALS",
  "UPI RISK INDICATORS",
  "TOP CONTRIBUTING FACTORS (SHAP)",
  "VISUAL PATTERN ANALYSIS",
  "RISK FACTOR SUMMARY"
];

for (const header of headers) {
  // Try to find the span or div containing the header and replace its styles
  // We'll use a regex that captures the style tag before the header text
  const regex = new RegExp(`(<(span|div)\\s+style={{[^}]*?)(fontSize:\\s*\\d+.*?)(}}>[\\s\\n]*${header.replace(/[()]/g, '\\$&')}[\\s\\n]*</(span|div)>)`, 'g');
  code = code.replace(regex, (match, prefix, tag1, oldStyles, suffix, tag2) => {
    // Determine the color to use. If it's riskColor, keep it, otherwise var(--t1).
    let newColor = "'var(--t1)'";
    if (oldStyles.includes('riskColor')) newColor = 'riskColor';

    // Replace the old style with the new style, but keep things like marginBottom or borderBottom if they existed
    let newStyles = `fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: ${newColor}, textTransform: 'uppercase'`;
    if (oldStyles.includes('marginBottom')) newStyles += `, marginBottom: 8`;
    if (oldStyles.includes('borderBottom')) newStyles += `, borderBottom: '1px solid var(--b1)', paddingBottom: 4`;
    if (oldStyles.includes('display: \'block\'')) newStyles += `, display: 'block'`;
    
    return `${prefix}${newStyles}${suffix}`;
  });
}

// 2. Section divider padding and border-bottom.
// The user asked: Between every major section in the analysis panel, replace border-bottom: 1px solid var(--b1) with: border-bottom: 1px solid var(--b2); AND add a 4px gap above each section header: padding-top: 16px instead of 14px.
// Let's replace padding: '14px 16px' with padding: '16px 16px', and borderBottom: '1px solid var(--b1)' with '1px solid var(--b2)' for the main section containers.
code = code.replace(/padding:\s*'14px 16px',\s*borderBottom:\s*'1px solid var\(--b1\)'/g, "padding: '16px 16px', borderBottom: '1px solid var(--b2)'");

// Also there's `<div style={{ padding: '16px', borderBottom: '1px solid var(--b1)'` in some places.
// We'll leave `padding: '16px'` alone but upgrade `borderBottom: '1px solid var(--b1)'` to `--b2` if it's a main section.
// A simpler way: we'll just search for `borderBottom: '1px solid var(--b1)'` where it's at the top level of a component tab and replace it. Wait, the regex `padding: '14px 16px', borderBottom: '1px solid var(--b1)'` targets `FlagGraphTab` perfectly.
code = code.replace(/<div style={{ padding: '16px',\s*borderBottom:\s*'1px solid var\(--b1\)'/g, "<div style={{ padding: '16px', borderBottom: '1px solid var(--b2)'");

// 3. Card Borders (left stripes, inner borders)
// "Before: border: 1px solid var(--b1)" -> "After: border: 1px solid var(--b2)"
// "Before: border-left: 3px solid [color]" -> "After: border-left: 4px solid [color]"
// "Card header border-bottom: 1px solid var(--b1) -> 1px solid var(--b2)"
code = code.replace(/border:\s*'1px solid var\(--b1\)',\s*borderLeft:\s*`3px solid \$\{riskColor\}`/g, "border: '1px solid var(--b2)', borderLeft: `4px solid ${riskColor}`");
code = code.replace(/border:\s*'1px solid var\(--b1\)',\s*borderLeft:\s*'3px solid var\(--(?:red|amber|green|cyan)\)'/g, (match) => match.replace('1px solid var(--b1)', '1px solid var(--b2)').replace('3px solid', '4px solid'));
// For "Card header border-bottom", let's replace `padding: '12px 14px', borderBottom: '1px solid var(--b1)'`
code = code.replace(/padding:\s*'12px 14px',\s*borderBottom:\s*'1px solid var\(--b1\)'/g, "padding: '12px 14px', borderBottom: '1px solid var(--b2)'");

// 4. Paper Badges visibility
// "font-size: 9px (was 7px), font-weight: 700 (was 600), letter-spacing: 1px, padding: 3px 8px (was 2px 7px), border-width: 1.5px (was 1px)"
// The PaperBadge component is at the top of App.jsx:
// function PaperBadge({ type }) {
// ... padding: '2px 7px', borderRadius: 4, border: '1px solid var(--cyan-20)'
code = code.replace(/function PaperBadge.*?return \(/s, (match) => {
  return match; 
});
code = code.replace(/padding:\s*'2px 7px',\s*borderRadius:\s*4,\s*border:\s*'1px solid([^']*)'/g, "padding: '3px 8px', borderRadius: 4, border: '1.5px solid$1'");
code = code.replace(/fontSize:\s*7,\s*fontWeight:\s*600/g, "fontSize: 9, fontWeight: 700, letterSpacing: '1px'");

// Increase background opacity for PaperBadge:
// For cyan: `background: 'var(--cyan-08)'` -> `background: 'var(--cyan-12)'`
// Since CSS vars for -12 don't exist, we'll use `rgba([color-rgb], 0.15)` or just let the user know we can inject it. Or we can just use `rgba()` strings:
code = code.replace(/background:\s*'var\(--cyan-08\)'/g, "background: 'rgba(0, 229, 195, 0.15)'");
code = code.replace(/background:\s*'var\(--purple-08\)'/g, "background: 'rgba(151, 71, 255, 0.15)'");
code = code.replace(/background:\s*'var\(--amber-08\)'/g, "background: 'rgba(254, 188, 46, 0.15)'");
code = code.replace(/background:\s*'var\(--blue-08\)'/g, "background: 'rgba(10, 132, 255, 0.15)'");
code = code.replace(/background:\s*'var\(--green-08\)'/g, "background: 'rgba(46, 204, 122, 0.15)'");
code = code.replace(/background:\s*'var\(--red-08\)'/g, "background: 'rgba(255, 59, 92, 0.15)'");


// 5. Risk Ring (100px diameter, drop-shadow glow)
// "Outer diameter: 100px, svg width=100 height=100 viewBox=0 0 100 100, Circle cx=50 cy=50, r=42, strokeWidth=6"
code = code.replace(/<svg width="88" height="88" viewBox="0 0 88 88"/g, '<svg width="100" height="100" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 4px ${color})` }}');
code = code.replace(/cx="44" cy="44" r="38"/g, 'cx="50" cy="50" r="42"');
code = code.replace(/strokeWidth="5"/g, 'strokeWidth="6"');
code = code.replace(/fontSize:\s*16,\s*fontWeight:\s*700/g, 'fontSize: 18, fontWeight: 800'); // for score text inside risk ring
code = code.replace(/fontSize:\s*7,\s*fontWeight:\s*600.*?RISK<\/text>/g, 'fontSize: "8", fontWeight: 700, fill: "var(--t3)", textAnchor: "middle"}>RISK</text>');


// 6. Agentic Pipeline Panel rows
// "Each row: min-height: 52px, Agent name 12px/700, Status badge 11px right-aligned, Detail text 11px, Active row styling with cyan border-left and spinArc"
code = code.replace(/minHeight:\s*44/g, "minHeight: 52");
code = code.replace(/padding:\s*'8px 12px'/g, "padding: '10px 14px'");
code = code.replace(/fontSize:\s*11,\s*fontWeight:\s*600,\s*color:\s*'var\(--t1\)'/g, "fontSize: 12, fontWeight: 700, color: 'var(--t1)', letterSpacing: '0.3px'");
code = code.replace(/<span style={{ fontSize: 9, fontWeight: 700, color: statusColor }}>/g, "<span style={{ fontSize: 11, fontWeight: 700, color: statusColor, marginLeft: 'auto' }}>");
// Also add spinArc for active row
// In AgentPipelineTab: `background: isActive ? 'var(--bg-2)' : 'transparent', borderBottom: '1px solid var(--b1)'`
code = code.replace(/background:\s*isActive \? 'var\(--bg-2\)' : 'transparent',\s*borderBottom:\s*'1px solid var\(--b1\)'/g, "background: isActive ? 'rgba(0,229,195,0.04)' : 'transparent', borderBottom: '1px solid var(--b1)', borderLeft: isActive ? '3px solid var(--cyan)' : '3px solid transparent'");

// FP chips height 32px
// "padding: '6px 12px', background: 'var(--bg-2)', border: '1px solid var(--b1)', borderRadius: 6" -> "height: 32, padding: '0 14px', ... border: '1px solid var(--b2)', display: 'flex', alignItems: 'center'"
code = code.replace(/padding:\s*'6px 12px',\s*background:\s*'var\(--bg-2\)',\s*border:\s*'1px solid var\(--b1\)'/g, "height: 32, padding: '0 14px', display: 'flex', alignItems: 'center', background: 'var(--bg-2)', border: '1px solid var(--b2)'");


// 7. Refine Status Bar items
// "Height: 30px, All text: font-size 10px / weight 600, SYSTEM OPERATIONAL 10px/700"
// Status bar component function:
code = code.replace(/height:\s*28,\s*background:\s*'var\(--bg-2\)',\s*borderTop:\s*'1px solid var\(--b1\)'/g, "height: 30, background: 'var(--bg-2)', borderTop: '1px solid var(--b1)'");
code = code.replace(/SYSTEM OPERATIONAL.*?<\/span>/s, (match) => {
  return match.replace(/fontSize:\s*9,\s*fontWeight:\s*400/, "fontSize: 10, fontWeight: 700");
});
code = code.replace(/>\|<\/span>/g, " style={{ color: 'var(--b3)', fontSize: 10 }}>|</span>");
// QUANTUM READY and ZK ACTIVE chip: height 20px, font 9px/700
code = code.replace(/height:\s*18,\s*border:\s*'1px solid var\(--cyan-20\)',\s*borderRadius:\s*4,\s*padding:\s*'0 6px',\s*fontSize:\s*8,\s*fontWeight:\s*600/g, "height: 20, border: '1px solid var(--cyan-20)', borderRadius: 4, padding: '0 6px', fontSize: 9, fontWeight: 700");
code = code.replace(/height:\s*18,\s*border:\s*'1px solid var\(--purple-20\)',\s*borderRadius:\s*4,\s*padding:\s*'0 6px',\s*fontSize:\s*8,\s*fontWeight:\s*600/g, "height: 20, border: '1px solid var(--purple-20)', borderRadius: 4, padding: '0 6px', fontSize: 9, fontWeight: 700");
// sessionTime
code = code.replace(/<span style={{ fontFamily: 'var\(--font-mono\)', fontSize: 9, color: 'var\(--t3\)' }}>\{Math.floor\(sessionTime/g, "<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--t2)' }}>{Math.floor(sessionTime");


fs.writeFileSync(path, code);
console.log('Styles updated.');
