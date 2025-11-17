import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-cyan-400/40 via-fuchsia-400/20 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/60 to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-10">
        <p className="uppercase tracking-widest text-cyan-300/80 text-sm">IT Recruitment • Modern, Fast, Precise</p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight">
          We connect elite tech talent with high-impact teams
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl">
          From full-stack engineers to data scientists, we source, vet, and present candidates who ship.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#open-roles" className="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition">View Open Roles</a>
          <a href="#submit-cv" className="px-5 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-white transition">Submit Your CV</a>
        </div>
      </div>
      <div className="relative h-[50vh] sm:h-[60vh]">
        <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
    </section>
  )
}

function Roles() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`${API_BASE}/jobs`).then(r => r.json()).then(setJobs).finally(()=>setLoading(false))
  }, [])
  return (
    <section id="open-roles" className="bg-slate-950 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold">Open Roles</h2>
        <p className="text-slate-400 mt-2">Curated opportunities with trusted partners.</p>
        {loading ? (
          <p className="mt-6 text-slate-400">Loading roles…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {jobs.length === 0 && (
              <div className="col-span-full text-slate-400">No roles yet. Be the first to post!</div>
            )}
            {jobs.map((job) => (
              <div key={job._id || job.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">{job.employment_type}</span>
                </div>
                <p className="text-slate-400 mt-1">{job.company} • {job.location}</p>
                <div className="flex gap-2 flex-wrap mt-3">
                  {(job.tags || []).slice(0,4).map((t, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{t}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-300 line-clamp-3">{job.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function SubmitCV() {
  const [form, setForm] = useState({ name: '', email: '', skills: '' })
  const [status, setStatus] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      const res = await fetch(`${API_BASE}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean),
        })
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('Thanks! We will be in touch.')
      setForm({ name: '', email: '', skills: '' })
    } catch (e) {
      setStatus('Something went wrong. Please try again.')
    }
  }
  return (
    <section id="submit-cv" className="bg-slate-950 text-white py-16 px-6 border-t border-slate-900">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">Submit your CV</h2>
        <p className="text-slate-400 mt-2">Tell us a bit about you and the roles you’re targeting.</p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Full name" className="bg-slate-900 border border-slate-800 rounded px-4 py-3 outline-none focus:border-cyan-500" required />
          <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email" className="bg-slate-900 border border-slate-800 rounded px-4 py-3 outline-none focus:border-cyan-500" required />
          <input value={form.skills} onChange={e=>setForm({...form, skills: e.target.value})} placeholder="Skills (comma separated)" className="bg-slate-900 border border-slate-800 rounded px-4 py-3 outline-none focus:border-cyan-500" />
          <button className="mt-2 px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition w-fit">Send</button>
          {status && <p className="text-slate-300">{status}</p>}
        </form>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-[Inter]">
      <Hero />
      <Roles />
      <SubmitCV />
      <footer className="text-center text-slate-500 text-sm py-10">© {new Date().getFullYear()} BlueTech Recruiters — All rights reserved.</footer>
    </div>
  )
}
