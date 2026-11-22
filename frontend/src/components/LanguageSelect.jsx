const languages = [
  ['en', 'English'], ['hi', 'Hindi'], ['as', 'Assamese'], ['bn', 'Bengali'], ['es', 'Spanish'],
  ['fr', 'French'], ['de', 'German'], ['it', 'Italian'], ['ja', 'Japanese'], ['pt', 'Portuguese'],
  ['ar', 'Arabic'], ['zh', 'Chinese'], ['ru', 'Russian'], ['ko', 'Korean'], ['ta', 'Tamil']
];

export default function LanguageSelect({ label, value, onChange, includeAuto = false }) {
  return <label className="language-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>
    {includeAuto && <option value="auto">Auto detect</option>}
    {languages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
  </select></label>;
}
