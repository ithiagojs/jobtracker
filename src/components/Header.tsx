import { Briefcase, Moon, Sun, Github, Linkedin } from 'lucide-react';

interface HeaderProps {
    theme?: 'dark' | 'light';
    toggleTheme?: () => void;
}

export function Header({ theme = 'dark', toggleTheme }: HeaderProps) {
    return (
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50 animate-slide-up">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:bg-primary/30 transition-all"></div>
                            <div className="relative bg-gradient-primary p-2.5 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gradient">
                                JobTracker
                            </h1>
                            <p className="text-sm text-muted-foreground hidden sm:block">
                                Busca inteligente de vagas
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {toggleTheme && (
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}
                        <a
                            href="https://www.linkedin.com/in/ithiagojs/"
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground hidden sm:block"
                            title="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="https://github.com/ithiagojs"
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground hidden sm:block"
                            title="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
