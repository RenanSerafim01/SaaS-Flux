import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const FeatureCard = ({ icon, title, description, badge }) => (
    <div className="bg-[#131826] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-gray-800/60 flex flex-col gap-3 md:gap-4 relative overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
        {badge && (
            <span className="absolute -right-6 md:-right-5 top-5 md:top-6 rotate-45 bg-sky-500/20 text-sky-400 text-[8px] md:text-[9px] px-8 py-1 font-black tracking-widest uppercase">
                {badge}
            </span>
        )}
        <div className="text-3xl md:text-4xl">{icon}</div>
        <h3 className="text-lg md:text-xl font-extrabold text-white uppercase tracking-tight">{title}</h3>
        <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">{description}</p>
    </div>
);

function LandingPage() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isRecuperarMode, setIsRecuperarMode] = useState(false);
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    const fecharModal = () => {
        setIsLoginModalOpen(false);
        setIsLoginMode(true);
        setIsRecuperarMode(false);
        setLogin('');
        setSenha('');
        setConfirmaSenha('');
        setMensagem({ texto: '', tipo: '' });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, senha })
            });

            if (resposta.ok) {
                const dados = await resposta.json();
                localStorage.setItem('token', dados.token);
                window.location.href = '/dashboard';
            } else {
                setMensagem({ texto: 'Usuário ou senha incorretos.', tipo: 'erro' });
            }
        } catch (erro) {
            console.error(erro);
            setMensagem({ texto: 'Servidor indisponível no momento.', tipo: 'erro' });
        }
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        if (senha !== confirmaSenha) {
            setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' });
            return;
        }

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, senha })
            });

            if (resposta.ok) {
                setMensagem({ texto: 'Conta criada com sucesso! Faça login.', tipo: 'sucesso' });
                setTimeout(() => {
                    setIsLoginMode(true);
                    setSenha('');
                    setConfirmaSenha('');
                    setMensagem({ texto: '', tipo: '' });
                }, 2000);
            } else {
                const errorText = await resposta.text();
                setMensagem({ texto: errorText || 'Erro ao criar conta.', tipo: 'erro' });
            }

        } catch (erro) {
            console.error(erro);
            setMensagem({ texto: 'Servidor indisponível no momento.', tipo: 'erro' });
        }
    };

    const handleRecuperarSenha = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        if (!login) {
            setMensagem({ texto: 'Por favor, digite seu e-mail.', tipo: 'erro' });
            return;
        }

        setMensagem({ texto: 'Buscando conta e gerando link...', tipo: 'sucesso' });

        setTimeout(() => {
            setMensagem({ texto: 'Se este e-mail estiver cadastrado, você receberá as instruções em instantes.', tipo: 'sucesso' });

            setTimeout(() => {
                setIsRecuperarMode(false);
                setMensagem({ texto: '', tipo: '' });
            }, 4000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white font-sans relative selection:bg-sky-500 selection:text-white">

            <div className="hidden md:block absolute top-[-10%] left-[20%] w-[40rem] h-[40rem] bg-sky-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* --- CABEÇALHO FLUX --- */}
            <header className="fixed top-0 left-0 w-full bg-[#0b0f19]/80 backdrop-blur-md z-40 border-b border-gray-800/60">
                <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#0b0f19] to-[#1a2133] rounded-xl border border-gray-800 shadow-lg shrink-0 overflow-hidden">
                            <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="fluxGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0ea5e9" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                    <linearGradient id="coinGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
                                    </linearGradient>
                                </defs>
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="url(#fluxGradLight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="4.5" fill="url(#coinGradLight)" stroke="url(#fluxGradLight)" strokeWidth="1.0" />
                                <path d="M12 9v6M13.5 10.5c0-.8-.6-1.5-1.5-1.5s-1.5.7-1.5 1.5c0 1.7 3 1.3 3 3 0 .8-.6 1.5-1.5 1.5s-1.5-.7-1.5-1.5" stroke="url(#fluxGradLight)" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Flux</h1>
                        <span className="bg-[#1a2133] text-sky-400 text-[8px] px-2 py-0.5 rounded-sm font-black tracking-widest self-center md:self-start md:mt-2 border border-gray-800">BETA</span>
                    </div>
                    <button onClick={() => setIsLoginModalOpen(true)} className="px-4 py-2 md:px-6 md:py-2.5 bg-sky-500 text-white font-extrabold text-[10px] md:text-xs rounded-xl uppercase tracking-wider hover:bg-sky-400 transition shadow-lg hover:shadow-sky-500/20">
                        Acessar Sistema
                    </button>
                </nav>
            </header>

            {/* --- SEÇÕES DA PÁGINA MANTIDAS IGUAIS --- */}
            <section className="pt-32 md:pt-40 pb-10 md:pb-16 px-4 md:px-6 relative z-10 flex flex-col items-center justify-center min-h-[65vh] md:min-h-[auto]">
                <div className="max-w-4xl mx-auto text-center w-full flex flex-col items-center">
                    <span className="inline-block bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[8px] md:text-[10px] px-4 py-1.5 rounded-full font-black tracking-widest uppercase mb-6 md:mb-8">
                        O Motor da sua Vida Financeira
                    </span>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[1.1] md:leading-[0.95] mb-6 md:mb-8 w-full px-2">
                        Assuma o comando <br className="hidden md:block" /> do seu <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">fluxo financeiro.</span>
                    </h2>
                    <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 md:mb-12 font-medium px-4 leading-relaxed">
                        O Flux é o sistema definitivo para você registrar, analisar e dominar para onde cada centavo do seu dinheiro está indo. Interface premium, sem planilhas chatas.
                    </p>
                    <button onClick={() => setIsLoginModalOpen(true)} className="px-8 md:px-12 py-4 md:py-5 bg-white text-[#0b0f19] font-black text-xs md:text-sm rounded-full uppercase tracking-wider hover:bg-gray-200 transition shadow-xl transform hover:scale-105">
                        Entrar na Versão Beta
                    </button>
                </div>
            </section>

            <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-[10px] md:text-sm font-black text-sky-500 uppercase tracking-widest mb-2">Recursos Ativos</h2>
                    <p className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">O que já construímos</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <FeatureCard icon="🎛️" title="Dashboard Premium" description="Acompanhe seus gastos com uma interface noturna moderna, barras de progresso automáticas e foco total na clareza dos dados." />
                    <FeatureCard icon="↻" title="Gestão de Recorrências" description="Separe os gastos avulsos das suas assinaturas e contas fixas. Saiba exatamente o peso das suas despesas mensais." />
                    <FeatureCard icon="📊" title="Categorias Inteligentes" description="Organize o dinheiro do seu jeito. Use nossas categorias de sistema ou crie marcadores personalizados para a sua rotina." />
                </div>
            </section>

            <section className="py-16 md:py-24 px-4 md:px-6 bg-[#131826] border-t border-gray-800/60 relative overflow-hidden">
                <div className="hidden md:block absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-[10px] md:text-sm font-black text-indigo-400 uppercase tracking-widest mb-2">Nosso Roadmap</h2>
                        <p className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight mb-4 md:mb-6">Para onde estamos indo</p>
                        <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                            O Flux está em evolução contínua. Estamos trabalhando pesado nos bastidores para trazer integrações diretas e inteligência artificial para o seu bolso.
                        </p>
                    </div>
                    <div className="space-y-4 md:space-y-6">
                        <FeatureCard icon="🏦" title="Conexão Bancária" description="Integração via Open Finance para puxar seus saldos e transações automaticamente do seu banco." badge="Em breve" />
                        <FeatureCard icon="💰" title="Gestão de Renda" description="Controle não só o que sai, mas também o que entra, tendo a visão completa do seu lucro no mês." badge="Em Breve" />
                        <FeatureCard icon="🎯" title="Metas e Reservas" description="Defina objetivos, guarde dinheiro com propósito e acompanhe a evolução do seu patrimônio." badge="Em Breve" />
                        <FeatureCard icon="📈" title="Relatórios com IA" description="Receba insights e conselhos gerados por Inteligência Artificial baseados no seu padrão de consumo." badge="Em breve" />
                    </div>
                </div>
            </section>

            <footer className="py-8 md:py-12 px-6 border-t border-gray-800/60 bg-[#0b0f19] text-center">
                <span className="text-gray-600 font-extrabold text-[8px] md:text-[10px] tracking-[0.25em] uppercase">
                    Flux Engine © 2026 | Versão Beta 1.0
                </span>
            </footer>

            {/* --- MODAL LOGIN, CADASTRO E RECUPERAÇÃO --- */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 transition-opacity backdrop-blur-sm" onClick={fecharModal}>

                    <div className="w-full max-w-sm p-6 md:p-10 bg-[#131826] border border-gray-800/60 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>

                        {/* --- CABEÇALHO DO MODAL --- */}
                        <div className="text-center mb-6 flex flex-col items-center mt-2 md:mt-0">
                            <div className="relative inline-block mb-1">
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                                    {isRecuperarMode ? 'Recuperar Senha' : (isLoginMode ? 'Acessar Sistema' : 'Criar Conta')}
                                </h2>
                                {!isRecuperarMode && isLoginMode && (
                                    <span className="absolute left-full top-0 ml-1 md:ml-2 mt-0 md:mt-0.5 bg-sky-500/20 text-sky-400 text-[8px] px-2 py-0.5 rounded-sm font-black tracking-widest uppercase">Beta</span>
                                )}
                            </div>
                            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-2">
                                {isRecuperarMode ? 'Enviaremos um link seguro' : (isLoginMode ? 'Identifique-se' : 'Junte-se ao Flux')}
                            </p>
                        </div>

                        {/* --- EXIBIÇÃO DE MENSAGENS --- */}
                        {mensagem.texto && (
                            <div className={`p-3 rounded-xl text-xs font-bold text-center tracking-wide mb-5 border ${mensagem.tipo === 'erro' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                {mensagem.texto}
                            </div>
                        )}

                        {/* --- FORMULÁRIO DINÂMICO --- */}
                        <form onSubmit={isRecuperarMode ? handleRecuperarSenha : (isLoginMode ? handleLogin : handleCadastro)} className="space-y-4 md:space-y-5">

                            {/* O campo E-mail aparece sempre */}
                            <div>
                                <label className="block mb-2 text-[9px] md:text-[10px] font-black text-gray-500 tracking-widest uppercase">Login (E-mail)</label>
                                <input type="email" value={login} onChange={(e) => setLogin(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-[#0b0f19] text-white font-bold text-sm border border-gray-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-gray-700" placeholder="usuario@email.com" required />
                            </div>

                            {/* O campo Senha NÃO aparece se for modo Recuperar */}
                            {!isRecuperarMode && (
                                <div>
                                    <label className="block mb-2 text-[9px] md:text-[10px] font-black text-gray-500 tracking-widest uppercase">Senha</label>
                                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-[#0b0f19] text-white font-bold text-sm border border-gray-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-gray-700" placeholder="••••••••••" required />
                                </div>
                            )}

                            {/* Campo Confirma Senha SÓ aparece no Cadastro */}
                            {!isRecuperarMode && !isLoginMode && (
                                <div>
                                    <label className="block mb-2 text-[9px] md:text-[10px] font-black text-gray-500 tracking-widest uppercase">Confirme a Senha</label>
                                    <input type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-[#0b0f19] text-white font-bold text-sm border border-gray-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-gray-700" placeholder="••••••••••" required />
                                </div>
                            )}

                            {/* Link de Esqueci a Senha SÓ aparece no Login */}
                            {!isRecuperarMode && isLoginMode && (
                                <div className="text-right">
                                    <button type="button" onClick={() => { setIsRecuperarMode(true); setMensagem({ texto: '', tipo: '' }); }} className="text-[10px] text-gray-500 hover:text-sky-400 transition font-bold tracking-wider uppercase">
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            )}

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-3 md:py-4 rounded-xl transition-all uppercase tracking-widest text-[10px] md:text-sm shadow-lg shadow-sky-500/20">
                                    {isRecuperarMode ? 'Enviar Link de Recuperação' : (isLoginMode ? 'Acessar Conta' : 'Cadastrar e Entrar')}
                                </button>
                            </div>
                        </form>

                        {/* --- BOTÃO DE RODAPÉ (ALTERNAR MODOS) --- */}
                        <div className="mt-6 text-center border-t border-gray-800/60 pt-6">
                            {isRecuperarMode ? (
                                <button
                                    type="button"
                                    onClick={() => { setIsRecuperarMode(false); setMensagem({ texto: '', tipo: '' }); }}
                                    className="text-[10px] md:text-xs text-gray-400 hover:text-white transition font-bold tracking-wider uppercase"
                                >
                                    ← Voltar para o Login
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoginMode(!isLoginMode);
                                        setMensagem({ texto: '', tipo: '' });
                                        setSenha('');
                                        setConfirmaSenha('');
                                    }}
                                    className="text-[10px] md:text-xs text-gray-400 hover:text-white transition font-bold tracking-wider uppercase"
                                >
                                    {isLoginMode ? 'Ainda não tem conta? Cadastre-se' : 'Já tem uma conta? Faça Login'}
                                </button>
                            )}
                        </div>

                        <button onClick={fecharModal} className="absolute top-4 md:top-6 right-4 md:right-6 text-gray-600 hover:text-white transition font-bold text-xl md:text-2xl leading-none">&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}