import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeftRight, AudioLines, Check, ChevronDown, CircleHelp, Headphones, Mic, Pause, Play, RotateCcw, ShieldCheck, Sparkles, Square, Volume2, Waves } from 'lucide-react';
import LanguageSelect from './components/LanguageSelect.jsx';
import { useRecorder } from './hooks/useRecorder.js';
import { getDubAudio, getDubStatus, requestTranslation } from './lib/api.js';

const labels = { queued: 'In the queue', dubbing: 'Translating your voice', dubbed: 'Your translation is ready', failed: 'Translation failed' };

export default function App() {
  const { recording, audioBlob, previewUrl, start, stop, discard } = useRecorder();
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [job, setJob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  async function translate() {
    if (!audioBlob) return;
    setError(''); setJob(null); setBusy(true);
    try {
      const result = await requestTranslation({ audio: audioBlob, sourceLanguage, targetLanguage });
      setJob({ id: result.dubbingId, status: result.status || 'dubbing' });
      discard();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    if (!job?.id || job.status === 'dubbed' || job.status === 'failed') return;
    const timer = setInterval(async () => {
      try {
        const next = await getDubStatus(job.id);
        setJob((current) => ({ ...current, ...next }));
        if (next.status === 'dubbed') {
          const blob = await getDubAudio(job.id, targetLanguage);
          setAudioUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(blob); });
        }
      } catch (cause) { setError(cause.message); }
    }, 3000);
    return () => clearInterval(timer);
  }, [job?.id, job?.status, targetLanguage]);

  async function toggleRecord() {
    setError('');
    try { if (recording) stop(); else await start(); }
    catch { setError('Microphone access is needed to record. Allow it in your browser settings and try again.'); }
  }

  function swapLanguages() {
    if (sourceLanguage !== 'auto') { setSourceLanguage(targetLanguage); setTargetLanguage(sourceLanguage); }
  }

  return <main className="shell">
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark"><AudioLines size={19} strokeWidth={2.4}/></span><span>voice<span className="brand-light">bridge</span></span></a>
      <div className="top-right"><span className="beta-tag"><span className="green-dot"/> EARLY ACCESS</span><button className="help-button" aria-label="About VoiceBridge"><CircleHelp size={19}/></button><div className="avatar">U</div></div>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> VOICE TO VOICE, WITHOUT BORDERS</div>
        <h1>Say it your way.<br/><span>Hear it their way.</span></h1>
        <p className="hero-subtitle">A little piece of your voice can go a long way.<br className="desktop-break"/> Speak naturally. We’ll carry the feeling across.</p>
      </div>
      <div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><Waves size={42} strokeWidth={1.4}/></div><span className="orbit-dot dot-a"/><span className="orbit-dot dot-b"/><span className="orbit-dot dot-c"/></div>
    </section>

    <section className="studio-card">
      <div className="card-topline"><div className="studio-heading"><span className="studio-icon"><Sparkles size={16}/></span><span>VOICE STUDIO</span></div><span className="step-label"><span className="step-number">01</span> RECORD & TRANSLATE</span></div>
      <div className="language-row">
        <LanguageSelect label="I’m speaking" value={sourceLanguage} onChange={setSourceLanguage} includeAuto/>
        <button className="swap-button" onClick={swapLanguages} aria-label="Swap languages"><ArrowLeftRight size={17}/></button>
        <LanguageSelect label="Translate into" value={targetLanguage} onChange={setTargetLanguage}/>
      </div>
      <div className={`recorder ${recording ? 'is-recording' : ''}`}>
        <div className="recorder-label"><span className="mic-icon"><Mic size={19}/></span><div><strong>{recording ? 'Listening to you' : audioBlob ? 'Your recording is ready' : 'Your turn to speak'}</strong><span>{recording ? 'Speak naturally — no need to rush' : audioBlob ? 'Listen back before you send it' : 'Tap the button and say something in your language'}</span></div></div>
        <div className="waveform" aria-hidden="true">{Array.from({length: 47}, (_,i) => <i key={i} style={{'--h': `${8 + ((i*17+3)%31)}px`, '--delay': `${(i%11)*.07}s`}}/>)}</div>
        <div className="record-actions">{audioBlob && !recording ? <button className="discard-button" onClick={discard}><RotateCcw size={15}/> Start over</button> : <span className="record-hint">{recording ? 'RECORDING' : 'UP TO 60 SECONDS'}</span>}<button className={`record-button ${recording ? 'record-stop' : ''}`} onClick={toggleRecord} aria-label={recording ? 'Stop recording' : 'Start recording'}>{recording ? <Square size={18} fill="currentColor"/> : <Mic size={20}/>}</button></div>
        {previewUrl && <div className="preview-player"><audio controls src={previewUrl}/></div>}
      </div>
      {error && <div className="error-message">{error}</div>}
      <button className="translate-button" onClick={translate} disabled={!audioBlob || busy || recording}>{busy ? <><span className="spinner"/> Sending your voice…</> : <>Translate my voice <ArrowDown size={17}/></>}</button>
      <div className="privacy-note"><ShieldCheck size={15}/><span>Your recording is sent securely and kept in server memory only while the request is processed.</span></div>
      {job && <div className="result-card"><div className="result-status"><span className={`status-pip ${job.status === 'dubbed' ? 'ready' : ''}`}/><div><strong>{labels[job.status] || 'Preparing your translation'}</strong><span>{job.status === 'dubbed' ? 'Generated with your selected target language' : 'This usually takes a short moment'}</span></div></div>{audioUrl && <div className="translated-player"><div className="translated-icon"><Headphones size={19}/></div><div className="translated-meta"><strong>Your translated voice</strong><span>{targetLanguage.toUpperCase()} · VOICE MATCH</span></div><audio controls src={audioUrl}/></div>}</div>}
    </section>

    <section className="how-row"><div className="how-copy"><span className="how-label">A MORE HUMAN WAY TO CONNECT</span><h2>Same voice.<br/><span>New language.</span></h2><p>This is an early experiment in voice translation. Try a short recording and hear how a familiar voice can travel to another language.</p><a className="learn-link" href="https://elevenlabs.io/docs/overview/capabilities/dubbing" target="_blank" rel="noreferrer">How voice translation works <ArrowDown size={14} className="learn-arrow"/></a></div><div className="steps"><div className="step"><span className="step-icon"><Mic size={17}/></span><div><strong>Speak naturally</strong><span>Record a short sample in your own voice.</span></div><span className="step-index">01</span></div><div className="step"><span className="step-icon"><ArrowLeftRight size={17}/></span><div><strong>Choose a language</strong><span>Tell us where your words are going.</span></div><span className="step-index">02</span></div><div className="step"><span className="step-icon"><Volume2 size={17}/></span><div><strong>Listen across languages</strong><span>Hear a translated version of your recording.</span></div><span className="step-index">03</span></div></div></section>
    <footer><a className="brand footer-brand" href="#top"><span className="brand-mark"><AudioLines size={16}/></span><span>voice<span className="brand-light">bridge</span></span></a><span>AN EXPLORATION IN BEING UNDERSTOOD.</span><span className="footer-right"><Check size={13}/> Built for curious voices</span></footer>
  </main>;
}
