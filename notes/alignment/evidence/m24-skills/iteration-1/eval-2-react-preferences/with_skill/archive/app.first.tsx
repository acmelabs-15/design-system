import { StrictMode, useState, useRef, type ComponentProps } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs } from '@acmelabs/design-system-react/components/tabs';
import { Tab } from '@acmelabs/design-system-react/components/tab';
import { TabPanel } from '@acmelabs/design-system-react/components/tab-panel';
import { RadioGroup } from '@acmelabs/design-system-react/components/radio-group';
import { RadioCard } from '@acmelabs/design-system-react/components/radio-card';
import { Group } from '@acmelabs/design-system-react/components/group';
import type { AcmeTabs } from '@acmelabs/design-system/components/tabs';
import '@acmelabs/design-system/styles/tokens.css';
import './style.css';

export const evidence = { callbacks: [] as {owner:string,value:string,native:boolean,revision:number}[], ref: null as AcmeTabs | null };
Object.assign(window, { evidence });
function Editor() {
  const [text, setText] = useState('Hello from Source');
  const [edits, setEdits] = useState(0);
  return <section><label htmlFor="editor">Source editor</label><textarea id="editor" value={text} onChange={e=>{setText(e.target.value);setEdits(n=>n+1);}}/><p id="edit-count">Edits: {edits}</p></section>;
}
function Preferences({ revision }: {revision:number}) {
  const [tab, setTab] = useState('source');
  const [plan, setPlan] = useState('starter');
  const tabs = useRef<AcmeTabs>(null);
  const onTab: NonNullable<ComponentProps<typeof Tabs>['onAcmeChange']> = event => {
    const value: string = event.detail.value;
    evidence.callbacks.push({owner:'tabs',value,native:event instanceof CustomEvent,revision});
    setTab(value);
  };
  const onPlan: NonNullable<ComponentProps<typeof RadioGroup>['onAcmeChange']> = event => {
    const value: string = event.detail.value;
    evidence.callbacks.push({owner:'plan',value,native:event instanceof CustomEvent,revision});
    setPlan(value);
  };
  return <div id="preferences">
    <Tabs ref={node=>{tabs.current=node;evidence.ref=node;}} ariaLabel="Preferences views" activation="manual" value={tab} onAcmeChange={onTab}>
      <Tab value="source">Source</Tab><Tab value="output">Output</Tab>
      <TabPanel slot="panels" value="source"><Editor /></TabPanel>
      <TabPanel slot="panels" value="output"><p>Output preview</p></TabPanel>
    </Tabs>
    <h2 id="plan-label">Choose your plan</h2>
    <RadioGroup aria-labelledby="plan-label" name="plan" value={plan} orientation="horizontal" onAcmeChange={onPlan}>
      <Group attached grow>
        <RadioCard value="starter"><span slot="heading">Starter</span><span slot="description">For personal projects</span></RadioCard>
        <RadioCard value="pro"><span slot="heading">Pro</span><span slot="description">For growing teams</span></RadioCard>
      </Group>
    </RadioGroup>
    <p id="status">View: {tab} · Plan: {plan}</p>
  </div>;
}
function App() {
  const [mounted,setMounted]=useState(true);
  const [revision,setRevision]=useState(0);
  return <main><h1>Preferences</h1><p>Configure your workspace and plan.</p>
    <div className="controls"><button id="mount" onClick={()=>setMounted(v=>!v)}>{mounted?'Unmount preferences':'Remount preferences'}</button><button id="replace" onClick={()=>setRevision(v=>v+1)}>Replace callbacks</button></div>
    {mounted&&<Preferences revision={revision}/>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
