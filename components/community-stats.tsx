import { Users, Star, Film, MessageSquare } from "lucide-react"

const stats = [
  { icon: Users, label: "Active Members", value: "2.4M" },
  { icon: Film, label: "Films Catalogued", value: "85K+" },
  { icon: Star, label: "Reviews Written", value: "12M+" },
  { icon: MessageSquare, label: "Opinions Shared", value: "340K" },
]

const opinions = [
  { user: "Sarah L.", text: "Cinema is the only art form where you can live a thousand lives.", color: "text-primary" },
  { user: "Ben R.", text: "Every frame is a painting. Every film is a conversation across time.", color: "text-sky-400" },
  { user: "Mia T.", text: "The best movies leave you feeling less alone in the universe.", color: "text-rose-400" },
  { user: "Carlos V.", text: "Film isn't just entertainment — it's empathy at scale.", color: "text-emerald-400" },
  { user: "Yuki N.", text: "I live for those moments when a film says what you couldn't put into words.", color: "text-amber-400" },
  { user: "Dana K.", text: "Great cinema asks questions. The best answers them with a single image.", color: "text-indigo-400" },
]

export function CommunityStats() {
  return (
    <section id="community" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-card border border-border p-5 flex flex-col items-center text-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Community opinions */}
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">What People Are Saying</span>
      </div>
      <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Community Voices</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opinions.map((o) => (
          <blockquote
            key={o.user}
            className="rounded-xl bg-card border border-border p-5 flex flex-col gap-4 hover:border-primary/40 transition-colors"
          >
            <p className="text-sm text-foreground leading-relaxed italic text-pretty">{`"${o.text}"`}</p>
            <footer className="flex items-center gap-2 mt-auto">
              <div className={`h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold ${o.color}`}>
                {o.user.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{o.user}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
