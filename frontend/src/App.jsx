import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

// --- COMPONENTES MENORES ---

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

// --- PÁGINA PRINCIPAL (LANDING PAGE) ---

function LandingPage() {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isRecuperarMode, setIsRecuperarMode] = useState(false);

    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [enviando, setEnviando] = useState(false);

    // --- CONTROLADORES DE FLUXO ---

    const fecharModal = () => {
        setIsLoginModalOpen(false);
        setIsLoginMode(true);
        setIsRecuperarMode(false);
        setNome('');
        setLogin('');
        setSenha('');
        setConfirmaSenha('');
        setMensagem({ texto: '', tipo: '' });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });
        setEnviando(true);

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, senha })
            });

            if (resposta.ok) {
                const dados = await resposta.json();
                localStorage.setItem('token', dados.token);
                localStorage.setItem('nomeUsuario', dados.nome);
                window.location.href = '/dashboard';
            } else {
                setMensagem({ texto: 'Usuário ou senha incorretos.', tipo: 'erro' });
            }

        } catch (erro) {
            console.error(erro);
            setMensagem({ texto: 'Servidor indisponível no momento.', tipo: 'erro' });
        } finally {
            setEnviando(false);
        }
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        if (senha !== confirmaSenha) {
            setMensagem({ texto: 'As senhas não coincidem.', tipo: 'erro' });
            return;
        }

        setEnviando(true);

        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, login, senha })
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
        } finally {
            setEnviando(false);
        }
    };

    const handleRecuperarSenha = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        if (!login) {
            setMensagem({ texto: 'Por favor, digite seu e-mail.', tipo: 'erro' });
            return;
        }

        setEnviando(true);
        setMensagem({ texto: 'Buscando conta e gerando link...', tipo: 'sucesso' });

        setTimeout(() => {
            setMensagem({ texto: 'Se este e-mail estiver cadastrado, você receberá as instruções em instantes.', tipo: 'sucesso' });

            setTimeout(() => {
                setIsRecuperarMode(false);
                setMensagem({ texto: '', tipo: '' });
                setEnviando(false);
            }, 4000);
        }, 1500);
    };

    // --- RENDERIZAÇÃO DA PÁGINA ---

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white font-sans relative selection:bg-sky-500 selection:text-white">

            <div className="hidden md:block absolute top-[-10%] left-[20%] w-[40rem] h-[40rem] bg-sky-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* --- CABEÇALHO DA LANDING PAGE --- */}

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

            {/* --- SEÇÃO HERO --- */}

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

            {/* --- SEÇÃO DE FEATURES --- */}

            <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-[10px] md:text-sm font-black text-sky-500 uppercase tracking-widest mb-2">Recursos Ativos</h2>
                    <p className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tight">O que já construímos</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <FeatureCard icon="💰" title="Gestão de Renda" description="Controle não só o que sai, mas também o que entra. Registre ganhos e acompanhe o cálculo de saldo consolidado em tempo real." />
                    <FeatureCard icon="🎛️" title="Dashboard Premium" description="Acompanhe seus gastos com uma interface noturna moderna, barras de progresso automáticas e foco total na clareza." />
                    <FeatureCard icon="↻" title="Recorrências" description="Separe os gastos avulsos das suas assinaturas e contas fixas. Saiba exatamente o peso das suas despesas mensais." />
                    <FeatureCard icon="📊" title="Categorias" description="Organize o dinheiro do seu jeito. Use nossas categorias de sistema ou crie marcadores personalizados para a sua rotina." />
                </div>
            </section>

            {/* --- SEÇÃO ROADMAP --- */}

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
                        <FeatureCard icon="🎯" title="Metas e Reservas" description="Defina objetivos, guarde dinheiro com propósito e acompanhe a evolução do seu patrimônio." badge="Em Breve" />
                        <FeatureCard icon="📈" title="Relatórios com IA" description="Receba insights e conselhos gerados por Inteligência Artificial baseados no seu padrão de consumo." badge="Em breve" />
                    </div>
                </div>
            </section>

            {/* --- RODAPÉ --- */}

            <footer className="py-8 md:py-12 px-6 border-t border-gray-800/60 bg-[#0b0f19] text-center">
                <span className="text-gray-600 font-extrabold text-[8px] md:text-[10px] tracking-[0.25em] uppercase">
                    Flux Engine © 2026 | Versão Beta 1.0
                </span>
            </footer>

            {/* --- MODAL DE AUTENTICAÇÃO --- */}

            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 transition-opacity backdrop-blur-sm" onClick={fecharModal}>

                    {/* [ALTERADO] Container principal agora é mais largo (max-w-4xl) e usa flex para dividir a tela */}
                    <div className="w-full max-w-4xl bg-white md:bg-transparent rounded-[1.5rem] md:rounded-[2rem] shadow-2xl relative flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>

                        {/* [ALTERADO] LADO ESQUERDO: Branding e Marketing (Inspirado no modelo premium) - Oculto no celular */}
                        <div className="hidden md:flex md:w-1/2 bg-[#0b0f19] border border-gray-800 p-12 text-white flex-col justify-between relative">
                            {/* Brilho de fundo sutil */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-900/20 rounded-full blur-[80px] pointer-events-none"></div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#0b0f19] to-[#1a2133] rounded-xl border border-gray-800 shadow-lg shrink-0 overflow-hidden">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="fluxGradLightModal" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#0ea5e9" />
                                                <stop offset="100%" stopColor="#6366f1" />
                                            </linearGradient>
                                            <linearGradient id="coinGradLightModal" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="url(#fluxGradLightModal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="12" r="4.5" fill="url(#coinGradLightModal)" stroke="url(#fluxGradLightModal)" strokeWidth="1.0" />
                                        <path d="M12 9v6M13.5 10.5c0-.8-.6-1.5-1.5-1.5s-1.5.7-1.5 1.5c0 1.7 3 1.3 3 3 0 .8-.6 1.5-1.5 1.5s-1.5-.7-1.5-1.5" stroke="url(#fluxGradLightModal)" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Flux</h2>
                            </div>

                            <div className="relative z-10 mt-16 mb-24">
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-4">
                                    {isRecuperarMode ? 'Sua segurança é nossa prioridade.' : (isLoginMode ? 'Bem-vindo de volta ao comando.' : 'A sua nova base financeira.')}
                                </h3>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                    Acesse sua plataforma integrada de gestão e tome decisões estratégicas com base em dados consolidados em tempo real.
                                </p>
                            </div>

                            <div className="relative z-10 text-[10px] text-gray-600 font-black tracking-widest uppercase">
                                © 2026 Flux Engine Beta
                            </div>
                        </div>

                        {/* [ALTERADO] LADO DIREITO: O Formulário (Design Claro / White Theme) */}
                        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 text-gray-900 flex flex-col justify-center relative">

                            {/* Botão de Fechar Modal adaptado para fundo branco */}
                            <button onClick={fecharModal} className="absolute top-4 md:top-6 right-4 md:right-6 text-gray-400 hover:text-gray-800 transition font-bold text-xl md:text-2xl leading-none">&times;</button>

                            <div className="mb-6 flex flex-col items-start">
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter">
                                    {isRecuperarMode ? 'Recuperar Senha' : (isLoginMode ? 'Acessar Conta' : 'Criar Conta')}
                                </h2>
                                <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                    {isRecuperarMode ? 'Enviaremos um link seguro' : 'Insira seus dados abaixo'}
                                </p>
                            </div>

                            {mensagem.texto && (
                                <div className={`p-3 rounded-xl text-xs font-bold text-center tracking-wide mb-5 border ${mensagem.tipo === 'erro' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                    {mensagem.texto}
                                </div>
                            )}

                            {/* [ALTERADO] Botão do Google e Separador (Visível apenas em Login e Cadastro) */}
                            {!isRecuperarMode && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => e.preventDefault()} // Botão preparado, mas inativo por enquanto
                                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 md:py-3.5 rounded-xl transition-all text-[10px] md:text-sm tracking-wide shadow-sm mb-6"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        Continuar com o Google
                                    </button>

                                    <div className="flex items-center mb-6">
                                        <div className="flex-1 border-t border-gray-200"></div>
                                        <span className="px-3 text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">Ou continue com e-mail</span>
                                        <div className="flex-1 border-t border-gray-200"></div>
                                    </div>
                                </>
                            )}

                            {/* Formulário com Inputs Claros */}
                            <form onSubmit={isRecuperarMode ? handleRecuperarSenha : (isLoginMode ? handleLogin : handleCadastro)} className="space-y-4 md:space-y-5">

                                {!isLoginMode && !isRecuperarMode && (
                                    <div>
                                        <label className="block mb-1.5 text-[9px] md:text-[10px] font-black text-gray-600 tracking-widest uppercase">Nome Completo</label>
                                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-50 text-gray-900 font-bold text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-all placeholder:text-gray-400" placeholder="Renan da Silva" required />
                                    </div>
                                )}

                                <div>
                                    <label className="block mb-1.5 text-[9px] md:text-[10px] font-black text-gray-600 tracking-widest uppercase">Login (E-mail)</label>
                                    <input type="email" value={login} onChange={(e) => setLogin(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-50 text-gray-900 font-bold text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-all placeholder:text-gray-400" placeholder="usuario@email.com" required />
                                </div>

                                {!isRecuperarMode && (
                                    <div>
                                        <label className="block mb-1.5 text-[9px] md:text-[10px] font-black text-gray-600 tracking-widest uppercase">Senha</label>
                                        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-50 text-gray-900 font-bold text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-all placeholder:text-gray-400" placeholder="••••••••••" required />
                                    </div>
                                )}

                                {!isRecuperarMode && !isLoginMode && (
                                    <div>
                                        <label className="block mb-1.5 text-[9px] md:text-[10px] font-black text-gray-600 tracking-widest uppercase">Confirme a Senha</label>
                                        <input type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-50 text-gray-900 font-bold text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-all placeholder:text-gray-400" placeholder="••••••••••" required />
                                    </div>
                                )}

                                {!isRecuperarMode && isLoginMode && (
                                    <div className="text-right">
                                        <button type="button" onClick={() => { setIsRecuperarMode(true); setMensagem({ texto: '', tipo: '' }); }} className="text-[10px] text-gray-500 hover:text-sky-500 transition font-bold tracking-wider uppercase">
                                            Esqueceu a senha?
                                        </button>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        className={`w-full bg-[#0b0f19] hover:bg-gray-800 text-white font-black py-3 md:py-4 rounded-xl transition-all uppercase tracking-widest text-[10px] md:text-sm shadow-xl ${enviando ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {enviando
                                            ? 'Aguarde...'
                                            : (isRecuperarMode ? 'Enviar Link de Recuperação' : (isLoginMode ? 'Acessar Conta' : 'Cadastrar Conta'))
                                        }
                                    </button>
                                </div>
                            </form>

                            {/* Alternância de Modos */}
                            <div className="mt-6 text-center">
                                {isRecuperarMode ? (
                                    <button
                                        type="button"
                                        onClick={() => { setIsRecuperarMode(false); setMensagem({ texto: '', tipo: '' }); }}
                                        className="text-[10px] md:text-xs text-gray-500 hover:text-gray-900 transition font-bold tracking-wider uppercase"
                                    >
                                        ← Voltar para o Login
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLoginMode(!isLoginMode);
                                            setMensagem({ texto: '', tipo: '' });
                                            setNome('');
                                            setSenha('');
                                            setConfirmaSenha('');
                                        }}
                                        className="text-[10px] md:text-xs text-gray-500 hover:text-gray-900 transition font-bold tracking-wider uppercase"
                                    >
                                        {isLoginMode ? 'Ainda não tem conta? Cadastre-se' : 'Já tem uma conta? Faça Login'}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- ROTAS DA APLICAÇÃO ---

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