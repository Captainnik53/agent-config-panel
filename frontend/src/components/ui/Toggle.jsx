export default function Toggle({ on = false, onChange }) {
  return (
    <div
      onClick={() => onChange?.(!on)}
      className={`relative w-10 h-[22px] rounded-full cursor-pointer flex-shrink-0 transition-colors duration-200 ${
        on ? 'bg-app-green' : 'bg-slate-600'
      }`}
    >
      <div
        className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
          on ? 'left-[21px]' : 'left-[3px]'
        }`}
      />
    </div>
  )
}
