export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">Repurposer</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Pricing</a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Transform 1 piece of content into a week of high-impact social posts
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto">
          Paste your blog post, transcript, or rough notes. Get ready-to-post Twitter threads, LinkedIn insights, and newsletters in seconds.
        </p>

        {/* Input Card */}
        <div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
              Blog Post
            </button>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors">
              Transcript
            </button>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors">
              Notes
            </button>
          </div>

          <textarea
            placeholder="Paste your content here... (e.g., blog post, meeting notes, podcast transcript)"
            className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-slate-500 text-sm">
              {0} characters
            </span>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25">
              Repurpose Content
            </button>
          </div>
        </div>

        {/* Preview Section (Dummy State) */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-400 text-sm font-medium">Ready to repurpose</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-xs font-bold">𝕏</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium mb-1">Twitter Thread</div>
                  <div className="text-slate-400 text-xs">5 tweets ready to post</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                <div className="w-8 h-8 bg-sky-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sky-400 text-xs font-bold">in</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium mb-1">LinkedIn Insight</div>
                  <div className="text-slate-400 text-xs">Professional take with key takeaways</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-xs font-bold">✉️</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium mb-1">Newsletter Draft</div>
                  <div className="text-slate-400 text-xs">Engaging email with actionable insights</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Repurposer. Built with ❤️ for content creators.</p>
      </footer>
    </main>
  );
}