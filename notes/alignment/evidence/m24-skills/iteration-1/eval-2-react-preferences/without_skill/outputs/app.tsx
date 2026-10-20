import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from '@acmelabs/design-system-react/components/tabs';
import { Tab } from '@acmelabs/design-system-react/components/tab';
import { TabPanel } from '@acmelabs/design-system-react/components/tab-panel';
import { RadioGroup } from '@acmelabs/design-system-react/components/radio-group';
import { RadioCard } from '@acmelabs/design-system-react/components/radio-card';
import { Group } from '@acmelabs/design-system-react/components/group';
import '@acmelabs/design-system/styles/tokens.css';
import './app.css';

declare global { interface Window { evidence: { events: {kind: string; value: string}[]; mounts: number; cleanups: number } } }
window.evidence = { events: [], mounts: 0, cleanups: 0 };
function Editor() {
 const [source, setSource] = useState('Hello from Source');
 useEffect(() => { window.evidence.mounts++; return () => { window.evidence.cleanups++; }; }, []);
 return <label>Source editor<textarea data-testid="editor" value={source} onChange={event => setSource(event.currentTarget.value)} /></label>;
}
function Preferences() {
 const [tab, setTab] = useState('source');
 const [plan, setPlan] = useState('starter');
 return <section aria-label="Preferences"><h1>Preferences</h1>
  <Tabs aria-label="Editor views" value={tab} activation="automatic" lazyMount unmountOnExit={false}
   onAcmeChange={event => { const value: string = event.detail.value; window.evidence.events.push({kind:'tab',value}); setTab(value); }}>
   <Tab value="source">Source</Tab><Tab value="output">Output</Tab>
   <TabPanel slot="panels" value="source" renderContent={() => <Editor />} />
   <TabPanel slot="panels" value="output" renderContent={() => <p>Output preview</p>} />
  </Tabs>
  <h2 id="plan-label">Plan</h2>
  <RadioGroup aria-labelledby="plan-label" name="plan" value={plan} orientation="horizontal"
   onAcmeChange={event => { const value: string = event.detail.value; window.evidence.events.push({kind:'plan',value}); setPlan(value); }}>
   <Group attached grow>
    <RadioCard value="starter"><span slot="heading">Starter</span><span slot="description">For personal projects</span></RadioCard>
    <RadioCard value="pro"><span slot="heading">Pro</span><span slot="description">For growing teams</span></RadioCard>
   </Group>
  </RadioGroup>
  <p data-testid="summary">View: {tab}; Plan: {plan}</p>
 </section>;
}
function App() {
 const [mounted, setMounted] = useState(true);
 return <main><button data-testid="mount" onClick={() => setMounted(value => !value)}>{mounted ? 'Unmount' : 'Remount'} preferences</button>{mounted && <Preferences />}</main>;
}
createRoot(document.getElementById('root')!).render(<App />);
