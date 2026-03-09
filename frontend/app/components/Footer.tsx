
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">About</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              このブログは僕が新しく学んだ技術や日々の学習を記録する為のものです
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Contact</h3>
                <a
                  href="mailto:kabochan7355@gmail.com"
                  className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                  Email
                </a>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Links</h3>
                <a
                  href="https://github.com/kabochan73"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                  GitHub
                </a>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-400">
          © 2026 Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
