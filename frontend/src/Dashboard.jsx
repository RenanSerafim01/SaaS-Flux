import { useState, useEffect } from 'react';

export default function Dashboard() {
    const nomeCompleto = localStorage.getItem('nomeUsuario') || 'Usuário';
    const primeiroNome = nomeCompleto.split(' ')[0];

    const [despesas, setDespesas] = useState([]);
    const [totalGastos, setTotalGastos] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [gastosFixos, setGastosFixos] = useState([]);

    const [rendas, setRendas] = useState([]);
    const [totalRendas, setTotalRendas] = useState(0);

    // Estados de Criação
    const [isModalRendaOpen, setIsModalRendaOpen] = useState(false);
    const [enviandoRenda, setEnviandoRenda] = useState(false);
    const [novaRenda, setNovaRenda] = useState({ descricao: '', valorReais: '', dataRecebimento: new Date().toISOString().split('T')[0] });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enviandoForm, setEnviandoForm] = useState(false);
    const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valorReais: '', dataDespesa: new Date().toISOString().split('T')[0], idCategoria: '', metodoPagamento: 'PIX' });

    const [isModalFixoOpen, setIsModalFixoOpen] = useState(false);
    const [enviandoFixo, setEnviandoFixo] = useState(false);
    const [novoGastoFixo, setNovoGastoFixo] = useState({ descricao: '', valorReais: '', diaVencimento: '10', idCategoria: '', metodoPagamento: 'DEBITO' });

    // ESTADOS DE EDIÇÃO
    const [isModalEditarDespesaOpen, setIsModalEditarDespesaOpen] = useState(false);
    const [despesaEmEdicao, setDespesaEmEdicao] = useState(null);

    const [isModalEditarFixoOpen, setIsModalEditarFixoOpen] = useState(false);
    const [fixoEmEdicao, setFixoEmEdicao] = useState(null);

    const [isModalEditarRendaOpen, setIsModalEditarRendaOpen] = useState(false);
    const [rendaEmEdicao, setRendaEmEdicao] = useState(null);

    const [isModalCategoriasOpen, setIsModalCategoriasOpen] = useState(false);
    const [menuMobileAberto, setMenuMobileAberto] = useState(false);

    const [paginaDespesas, setPaginaDespesas] = useState(1);
    const [paginaFixos, setPaginaFixos] = useState(1);
    const [paginaRendas, setPaginaRendas] = useState(1);
    const itensPorPagina = 6;

    const [notificacao, setNotificacao] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });

    const mostrarNotificacao = (mensagem, tipo = 'sucesso') => {
        setNotificacao({ visivel: true, mensagem, tipo });
        setTimeout(() => {
            setNotificacao(prev => ({ ...prev, visivel: false }));
        }, 3000);
    };

    const buscarDados = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

            const respostaDespesas = await fetch(`${import.meta.env.VITE_API_URL}/despesas?size=1000`, { method: 'GET', headers });
            if (respostaDespesas.ok) {
                const pagina = await respostaDespesas.json();
                setDespesas(pagina.content || []);
                setTotalGastos((pagina.content || []).reduce((acc, d) => acc + ((d.valorCentavos || 0) / 100), 0));
            } else if (respostaDespesas.status === 403) {
                localStorage.removeItem('token'); window.location.href = '/';
            }

            const respostaCategorias = await fetch(`${import.meta.env.VITE_API_URL}/categorias?size=1000`, { method: 'GET', headers });
            if (respostaCategorias.ok) {
                const dadosCat = await respostaCategorias.json();
                const listaCategorias = dadosCat.content || dadosCat || [];
                setCategorias(listaCategorias);
                if (listaCategorias.length > 0) {
                    if (!novaDespesa.idCategoria) setNovaDespesa(prev => ({ ...prev, idCategoria: listaCategorias[0].id.toString() }));
                    if (!novoGastoFixo.idCategoria) setNovoGastoFixo(prev => ({ ...prev, idCategoria: listaCategorias[0].id.toString() }));
                }
            }

            try {
                const respostaFixos = await fetch(`${import.meta.env.VITE_API_URL}/gastos-fixos?size=1000`, { method: 'GET', headers });
                if (respostaFixos.ok) setGastosFixos((await respostaFixos.json()).content || []);
            } catch (e) { console.error("Erro ao buscar gastos fixos:", e); setGastosFixos([]); }

            try {
                const respostaRendas = await fetch(`${import.meta.env.VITE_API_URL}/rendas?size=1000`, { method: 'GET', headers });
                if (respostaRendas.ok) {
                    const dadosRenda = await respostaRendas.json();
                    const rendasList = dadosRenda.content || [];
                    setRendas(rendasList);
                    setTotalRendas(rendasList.reduce((acc, r) => acc + ((r.valorCentavos || 0) / 100), 0));
                }
            } catch (e) { console.error("Erro ao buscar rendas:", e); setTotalRendas(0); setRendas([]); }

        } catch (erro) {
            console.error("Erro geral ao buscar dados:", erro);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => { buscarDados(); }, []);

    // =========================================================================
    // FUNÇÕES DE CRIAÇÃO (POST)
    // =========================================================================
    const handleCadastrarRenda = async (e) => {
        e.preventDefault();
        setEnviandoRenda(true);
        try {
            const token = localStorage.getItem('token');
            const valorCentavos = Math.round(parseFloat(novaRenda.valorReais.replace(/\./g, '').replace(',', '.')) * 100);

            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/rendas`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: novaRenda.descricao, valorCentavos: valorCentavos, dataRecebimento: novaRenda.dataRecebimento })
            });

            if (resposta.ok) {
                setNovaRenda({ descricao: '', valorReais: '', dataRecebimento: new Date().toISOString().split('T')[0] });
                setIsModalRendaOpen(false);
                buscarDados();
                setPaginaRendas(1);
                mostrarNotificacao('Renda registrada com sucesso!');
            } else {
                alert(`Erro do Servidor: ${await resposta.text() || resposta.status}`);
            }
        } catch (erro) { console.error(erro); } finally { setEnviandoRenda(false); }
    };

    const handleCadastrarDespesa = async (e) => {
        e.preventDefault();
        setEnviandoForm(true);
        try {
            const token = localStorage.getItem('token');
            const valorCentavos = Math.round(parseFloat(novaDespesa.valorReais.replace(/\./g, '').replace(',', '.')) * 100);
            const dataFormatada = new Date(`${novaDespesa.dataDespesa}T00:00:00Z`).toISOString();
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/despesas`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: novaDespesa.descricao, valorCentavos, dataDespesa: dataFormatada, idCategoria: parseInt(novaDespesa.idCategoria), metodoPagamento: novaDespesa.metodoPagamento })
            });
            if (resposta.ok) {
                const primeiraCatId = categorias.length > 0 ? categorias[0].id.toString() : '';
                setNovaDespesa({ descricao: '', valorReais: '', dataDespesa: new Date().toISOString().split('T')[0], idCategoria: primeiraCatId, metodoPagamento: 'PIX' });
                setIsModalOpen(false);
                buscarDados();
                setPaginaDespesas(1);
                mostrarNotificacao('Gasto registrado com sucesso!');
            }
        } catch (erro) { console.error(erro); } finally { setEnviandoForm(false); }
    };

    const handleCadastrarGastoFixo = async (e) => {
        e.preventDefault();
        setEnviandoFixo(true);
        try {
            const token = localStorage.getItem('token');
            const valorCentavos = Math.round(parseFloat(novoGastoFixo.valorReais.replace(/\./g, '').replace(',', '.')) * 100);
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/gastos-fixos`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: novoGastoFixo.descricao, valorCentavos, diaVencimento: parseInt(novoGastoFixo.diaVencimento), idCategoria: parseInt(novoGastoFixo.idCategoria), metodoPagamento: novoGastoFixo.metodoPagamento })
            });
            if (resposta.ok) {
                const primeiraCatId = categorias.length > 0 ? categorias[0].id.toString() : '';
                setNovoGastoFixo({ descricao: '', valorReais: '', diaVencimento: '10', idCategoria: primeiraCatId, metodoPagamento: 'DEBITO' });
                setIsModalFixoOpen(false);
                buscarDados();
                setPaginaFixos(1);
                mostrarNotificacao('Gasto fixo registrado com sucesso!')
            }
        } catch (erro) { console.error(erro); } finally { setEnviandoFixo(false); }
    };

    // =========================================================================
    // FUNÇÕES DE EDIÇÃO E EXCLUSÃO (PUT E DELETE)
    // =========================================================================

    // --- DESPESAS ---
    const abrirModalEditarDespesa = (despesa) => {
        setDespesaEmEdicao({
            ...despesa,
            valorReais: ((despesa.valorCentavos || 0) / 100).toFixed(2).replace('.', ','),
            dataDespesa: despesa.dataDespesa ? despesa.dataDespesa.split('T')[0] : '',
            idCategoria: despesa.categoria?.id || (categorias.length > 0 ? categorias[0].id : ''),
            metodoPagamento: despesa.metodoPagamento || 'PIX'
        });
        setIsModalEditarDespesaOpen(true);
    };

    const handleAtualizarDespesa = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const valorCentavos = Math.round(parseFloat(despesaEmEdicao.valorReais.replace(/\./g, '').replace(',', '.')) * 100);
            const dataFormatada = new Date(`${despesaEmEdicao.dataDespesa}T00:00:00Z`).toISOString();

            await fetch(`${import.meta.env.VITE_API_URL}/despesas`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: despesaEmEdicao.id,
                    descricao: despesaEmEdicao.descricao,
                    valorCentavos,
                    dataDespesa: dataFormatada,
                    idCategoria: parseInt(despesaEmEdicao.idCategoria),
                    metodoPagamento: despesaEmEdicao.metodoPagamento
                })
            });
            setIsModalEditarDespesaOpen(false);
            buscarDados();
            mostrarNotificacao('Gasto atualizado com sucesso!', 'sucesso');
        } catch (erro) {
            console.error(erro);
            mostrarNotificacao('Erro ao atualizar gasto.', 'erro');
        }
    };

    const handleApagarDespesaEdicao = async () => {
        if (!window.confirm(`Deseja realmente apagar o gasto "${despesaEmEdicao.descricao}"?`)) return;
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/despesas/${despesaEmEdicao.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (resposta.ok) {
                setIsModalEditarDespesaOpen(false);
                buscarDados();
                mostrarNotificacao('Gasto apagado com sucesso!', 'sucesso');
            }
        } catch (erro) {
            console.error(erro);
            mostrarNotificacao('Erro ao apagar gasto.', 'erro');
        }
    };

    // --- GASTOS FIXOS ---
    const abrirModalEditarFixo = (fixo) => {
        setFixoEmEdicao({
            ...fixo,
            valorReais: ((fixo.valorCentavos || 0) / 100).toFixed(2).replace('.', ','),
            idCategoria: fixo.categoria?.id || (categorias.length > 0 ? categorias[0].id : ''),
            metodoPagamento: fixo.metodoPagamento || 'PIX'
        });
        setIsModalEditarFixoOpen(true);
    };

    const handleAtualizarFixo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const valorCentavos = Math.round(parseFloat(fixoEmEdicao.valorReais.replace(/\./g, '').replace(',', '.')) * 100);

            await fetch(`${import.meta.env.VITE_API_URL}/gastos-fixos`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: fixoEmEdicao.id,
                    descricao: fixoEmEdicao.descricao,
                    valorCentavos,
                    diaVencimento: parseInt(fixoEmEdicao.diaVencimento),
                    idCategoria: parseInt(fixoEmEdicao.idCategoria),
                    metodoPagamento: fixoEmEdicao.metodoPagamento
                })
            });
            setIsModalEditarFixoOpen(false);
            buscarDados();
            mostrarNotificacao('Gasto fixo atualizado!', 'sucesso');
        } catch (erro) {
            console.error(erro);
            mostrarNotificacao('Erro ao atualizar gasto fixo.', 'erro');
        }
    };

    const handleApagarFixoEdicao = async () => {
        if (!window.confirm(`Deseja cancelar o gasto recorrente "${fixoEmEdicao.descricao}"?`)) return;
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/gastos-fixos/${fixoEmEdicao.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (resposta.ok) {
                setIsModalEditarFixoOpen(false);
                buscarDados();
                mostrarNotificacao('Gasto fixo excluído com sucesso!', 'sucesso');
            }
        } catch (erro) {
            console.error(erro);
            mostrarNotificacao('Erro ao excluir gasto fixo.', 'erro');
        }
    };

    // --- RENDAS ---
    const abrirModalEditarRenda = (renda) => {
        setRendaEmEdicao({
            ...renda,
            valorReais: ((renda.valorCentavos || 0) / 100).toFixed(2).replace('.', ','),
            dataRecebimento: renda.dataRecebimento ? renda.dataRecebimento.split('T')[0] : ''
        });
        setIsModalEditarRendaOpen(true);
    };

    const handleAtualizarRenda = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const valorCentavos = Math.round(parseFloat(rendaEmEdicao.valorReais.replace(/\./g, '').replace(',', '.')) * 100);

            await fetch(`${import.meta.env.VITE_API_URL}/rendas`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: rendaEmEdicao.id,
                    descricao: rendaEmEdicao.descricao,
                    valorCentavos,
                    dataRecebimento: rendaEmEdicao.dataRecebimento
                })
            });
            setIsModalEditarRendaOpen(false);
            buscarDados();
            mostrarNotificacao('Renda atualizada com sucesso!', 'sucesso');
        } catch (erro) {
            console.error(erro);
            mostrarNotificacao('Erro ao atualizar renda.', 'erro');
        }
    };

    const handleApagarRendaEdicao = async () => {
        if (!window.confirm(`Deseja apagar a entrada de dinheiro "${rendaEmEdicao.descricao}"?`)) return;
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/rendas/${rendaEmEdicao.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (resposta.ok) {
                setIsModalEditarRendaOpen(false)
                buscarDados();
                mostrarNotificacao('Renda excluída com sucesso!', 'sucesso');
            }
        } catch (erro) {
            console.error(erro);
            mostrarNotificacao('Erro ao excluir renda.', 'erro');
        }
    };

    // --- CATEGORIAS ---
    const handleCriarCategoria = async () => {
        const nomeCategoria = window.prompt("Nova categoria:");
        if (!nomeCategoria) return;
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/categorias`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeCategoria })
            });
            if (resposta.ok) {
                const nova = await resposta.json();
                buscarDados();
                setNovaDespesa(p => ({ ...p, idCategoria: nova.id.toString() }));
                setNovoGastoFixo(p => ({ ...p, idCategoria: nova.id.toString() }));
                mostrarNotificacao(`Categoria "${nomeCategoria}" criada!`, 'sucesso');
            }else {
                mostrarNotificacao('Erro ao criar categoria.', 'erro');
            }
        } catch (erro) {
            console.error("Erro ao criar categoria:", erro);
            mostrarNotificacao('Erro de conexão.', 'erro');
        }
    };

    const handleExcluirCategoria = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja apagar a categoria "${nome}"?`)) return;
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/categorias/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            if (resposta.ok) {
                setCategorias(categorias.filter(c => c.id !== id));
                mostrarNotificacao(`Categoria "${nome}" apagada!`, 'sucesso');
            }
            else {
                mostrarNotificacao(`A categoria "${nome}" está em uso por algum registro e não pode ser excluída.`, 'erro');
            }
        } catch (erro) {
            console.error("Erro ao excluir categoria:", erro);
            mostrarNotificacao('Erro ao excluir categoria.', 'erro');
        }
    };

    // =========================================================================
    // FORMATAÇÃO E CÁLCULOS
    // =========================================================================
    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    const formatarData = (dataIso) => { if (!dataIso) return '--/--/----'; return new Date(dataIso).toLocaleDateString('pt-BR', {timeZone: 'UTC'}); };

    const totalFixos = gastosFixos.reduce((acc, f) => acc + ((f.valorCentavos || 0) / 100), 0);
    const totalSaidas = totalGastos + totalFixos;
    const saldoConsolidado = totalRendas - totalSaidas;

    const corSaldoCard = saldoConsolidado >= 0 ? "from-emerald-600 to-teal-900 shadow-emerald-900/20" : "from-rose-600 to-red-900 shadow-rose-900/20";
    const totalTransacoes = despesas.length + gastosFixos.length;

    const resumoCategorias = categorias.map(cat => {
        const totalAvulsas = despesas.filter(d => (d.categoria?.id || d.categoria) === cat.id).reduce((acc, d) => acc + ((d.valorCentavos || 0) / 100), 0);
        const totalGastosFixos = gastosFixos.filter(f => (f.categoria?.id || f.categoria) === cat.id).reduce((acc, f) => acc + ((f.valorCentavos || 0) / 100), 0);
        return { nome: cat.nome || cat.category_name, total: totalAvulsas + totalGastosFixos };
    }).filter(c => c.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);

    const totalDespesasParaPorcentagem = resumoCategorias.reduce((acc, c) => acc + c.total, 0) || 1;

    const despesasOrdenadas = [...despesas].sort((a, b) => {
        const dateDiff = new Date(b.dataDespesa) - new Date(a.dataDespesa);
        if (dateDiff !== 0) return dateDiff;
        return b.id - a.id;
    });

    const fixosOrdenados = [...gastosFixos].reverse();

    const rendasOrdenadas = [...rendas].sort((a, b) => {
        const dateDiff = new Date(b.dataRecebimento) - new Date(a.dataRecebimento);
        if (dateDiff !== 0) return dateDiff;
        return b.id - a.id;
    });

    const despesasAtuais = despesasOrdenadas.slice((paginaDespesas - 1) * itensPorPagina, paginaDespesas * itensPorPagina);
    const fixosAtuais = fixosOrdenados.slice((paginaFixos - 1) * itensPorPagina, paginaFixos * itensPorPagina);
    const rendasAtuais = rendasOrdenadas.slice((paginaRendas - 1) * itensPorPagina, paginaRendas * itensPorPagina);

    // =========================================================================
    // CSS CLASSES
    // =========================================================================
    const cardClass = "bg-[#131826] border border-gray-800/60 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-2xl relative";
    const sidebarButton = "w-full h-[60px] px-6 bg-[#1a2133] hover:bg-sky-500 hover:text-white rounded-2xl transition-all font-bold text-sm text-gray-300 text-left flex items-center justify-between shrink-0 group";
    const inputClass = "w-full px-4 py-3 md:px-5 md:py-3.5 bg-[#0b0f19] text-white font-bold border border-gray-800 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder:text-gray-600";
    const labelClass = "block mb-2 text-xs font-bold text-gray-400 tracking-wide uppercase";

    const iconeLapis = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
    );

    return (
        <div className="flex h-screen bg-[#0b0f19] text-white font-sans overflow-hidden">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                @media (min-width: 768px) { .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #475569; }
            `}</style>

            {menuMobileAberto && (
                <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setMenuMobileAberto(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] md:w-[340px] bg-[#131826] border-r border-gray-800/50 flex flex-col p-6 md:p-8 shadow-2xl shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${menuMobileAberto ? 'translate-x-0' : '-translate-x-full'}`}>
                <button onClick={() => setMenuMobileAberto(false)} className="md:hidden absolute top-6 right-6 text-gray-500 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="mb-8 md:mb-10 mt-2 md:mt-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#0b0f19] to-[#1a2133] rounded-2xl border border-gray-800 shadow-lg shrink-0 overflow-hidden">
                            <svg className="w-7 h-7 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="fluxGradSidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0ea5e9" /><stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                </defs>
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="url(#fluxGradSidebar)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#fluxGradSidebar)" strokeWidth="1.0" />
                                <path d="M12 9v6M13.5 10.5c0-.8-.6-1.5-1.5-1.5s-1.5.7-1.5 1.5c0 1.7 3 1.3 3 3 0 .8-.6 1.5-1.5 1.5s-1.5-.7-1.5-1.5" stroke="url(#fluxGradSidebar)" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter truncate">Flux</h1>
                    </div>
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-black tracking-[0.25em] mt-2 uppercase ml-1">Comande seu dinheiro</p>
                </div>

                <div className="px-1 mb-6">
                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.1em] mb-1">Bem-vindo,</p>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter truncate">{primeiroNome}!</h2>
                </div>

                <div className={`bg-gradient-to-br ${corSaldoCard} rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 mb-8 md:mb-10 shadow-lg transform hover:scale-[1.02] transition-all duration-500`}>
                    <p className="text-white/80 font-medium text-[10px] md:text-xs tracking-wider uppercase mb-1">Saldo Atual</p>
                    <p className="text-2xl md:text-3xl font-black text-white truncate">{carregando ? '...' : formatarMoeda(saldoConsolidado)}</p>
                    <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-white/20 flex gap-2">
                        <span className="bg-white/20 text-white text-[9px] md:text-[10px] px-2 md:px-3 py-1 md:py-1.5 rounded-md font-bold uppercase tracking-wider">{totalTransacoes} Transações</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-2 md:gap-3 flex-grow overflow-y-auto custom-scrollbar pr-2">
                    <p className="text-gray-600 text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase mb-1 ml-2">Ações Rápidas</p>

                    <button onClick={() => { setIsModalRendaOpen(true); setMenuMobileAberto(false); }} className={sidebarButton}>
                        <div className="flex items-center gap-3"><span className="text-emerald-400">💰</span> Registrar Renda</div>
                    </button>
                    <button onClick={() => { setIsModalOpen(true); setMenuMobileAberto(false); }} className={sidebarButton}>
                        <div className="flex items-center gap-3"><span className="text-rose-400">-</span> Registrar Despesa</div>
                    </button>
                    <button onClick={() => { setIsModalFixoOpen(true); setMenuMobileAberto(false); }} className={sidebarButton}>
                        <div className="flex items-center gap-3"><span>↻</span> Gasto Recorrente</div>
                    </button>
                    <button onClick={() => { setIsModalCategoriasOpen(true); setMenuMobileAberto(false); }} className={sidebarButton}>
                        <div className="flex items-center gap-3"><span>⚙</span> Ajustar Categorias</div>
                    </button>

                    <p className="text-gray-600 text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase mt-4 md:mt-6 mb-1 ml-2">Em Desenvolvimento</p>
                    <div className={`${sidebarButton} opacity-50 cursor-not-allowed flex`} title="Funcionalidade em desenvolvimento">
                        <div className="flex items-center gap-3"><span>🏦</span> Conexão Bancária</div><span className="bg-sky-500/20 text-sky-400 text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-widest hidden md:block">Em breve</span>
                    </div>
                    <div className={`${sidebarButton} opacity-50 cursor-not-allowed flex`} title="Funcionalidade em desenvolvimento">
                        <div className="flex items-center gap-3"><span>🎯</span> Metas e Reservas</div><span className="bg-fuchsia-500/20 text-fuchsia-400 text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-widest hidden md:block">Em breve</span>
                    </div>
                    <div className={`${sidebarButton} opacity-50 cursor-not-allowed flex`} title="Funcionalidade em desenvolvimento">
                        <div className="flex items-center gap-3"><span>🗑️</span> Lixeira e Restauração</div><span className="bg-rose-500/20 text-rose-400 text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-widest hidden md:block">Em breve</span>
                    </div>
                </nav>

                <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="mt-4 md:mt-6 py-3 md:py-4 text-gray-500 hover:text-red-400 font-bold text-xs md:text-sm text-left px-2 transition-colors uppercase tracking-wider">
                    Sair do Sistema
                </button>
            </aside>

            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 relative w-full">
                <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-sky-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="md:hidden flex items-center justify-between mb-6 bg-[#131826] p-4 rounded-2xl border border-gray-800/60 shadow-lg gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl font-black text-white uppercase tracking-tighter truncate flex-1">Flux</span>
                        </div>
                        <button onClick={() => setMenuMobileAberto(true)} className="p-3 bg-[#1a2133] hover:bg-sky-500 rounded-lg text-white transition-colors shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className={`${cardClass} flex items-center justify-between`}>
                            <div className="flex flex-col items-start min-w-0 flex-1 pr-3">
                                <p className="text-gray-500 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-1">Renda Total (Entradas)</p>
                                <p className="text-xl md:text-2xl font-black text-emerald-400 mb-2 truncate w-full">{carregando ? '...' : formatarMoeda(totalRendas)}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-lg md:text-xl shrink-0">💰</div>
                        </div>

                        <div className={`${cardClass} flex items-center justify-between`}>
                            <div className="flex flex-col items-start min-w-0 flex-1 pr-3">
                                <p className="text-gray-500 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-1">Despesas Avulsas</p>
                                <p className="text-xl md:text-2xl font-black text-white mb-2 truncate w-full">{carregando ? '...' : formatarMoeda(totalGastos)}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 text-lg md:text-xl shrink-0">💳</div>
                        </div>

                        <div className={`${cardClass} flex items-center justify-between`}>
                            <div className="flex flex-col items-start min-w-0 flex-1 pr-3">
                                <p className="text-gray-500 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-1">Gastos Fixos Mensais</p>
                                <p className="text-xl md:text-2xl font-black text-white mb-2 truncate w-full">{formatarMoeda(totalFixos)}</p>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-lg md:text-xl shrink-0">↻</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                        <div className="xl:col-span-2 space-y-6 md:space-y-8">

                            {/* TABELA DE DESPESAS AVULSAS */}
                            <div className={cardClass}>
                                <div className="flex justify-between items-center mb-4 md:mb-6">
                                    <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest">Extrato Avulso Recente</h2>
                                </div>
                                <div className="space-y-1">
                                    {carregando ? <p className="text-gray-500 py-4 text-sm">Buscando...</p> : despesasAtuais.map((despesa, index) => (
                                        <div key={index} className="group flex justify-between items-center py-3 md:py-4 border-b border-gray-800/50 hover:bg-[#1a2133] rounded-xl px-2 md:px-4 transition-colors gap-3">
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <p className="font-extrabold text-xs md:text-sm text-gray-200 truncate">{despesa.descricao || 'Sem nome'}</p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="text-[9px] md:text-[10px] font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded uppercase truncate max-w-[120px]">{despesa.categoria?.nome || 'Geral'}</span>
                                                    <span className="text-[10px] md:text-[11px] font-medium text-gray-500 shrink-0">{formatarData(despesa.dataDespesa)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-6 shrink-0">
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="font-bold text-white text-sm md:text-base">- {formatarMoeda((despesa.valorCentavos || 0) / 100)}</p>
                                                </div>
                                                {/* BOTÃO DO LÁPIS AQUI */}
                                                <button onClick={() => abrirModalEditarDespesa(despesa)} className="text-gray-600 hover:text-sky-500 md:opacity-0 group-hover:opacity-100 transition-all p-2" title="Editar Despesa">{iconeLapis}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 md:mt-6 pt-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <button disabled={paginaDespesas === 1} onClick={() => setPaginaDespesas(p => p - 1)} className="hover:text-sky-400 disabled:opacity-50 px-3 py-1.5">Anterior</button>
                                    <span>Pág {paginaDespesas}</span>
                                    <button disabled={despesas.length <= paginaDespesas * itensPorPagina} onClick={() => setPaginaDespesas(p => p + 1)} className="hover:text-sky-400 disabled:opacity-50 px-3 py-1.5">Próxima</button>
                                </div>
                            </div>

                            {/* TABELA DE GASTOS FIXOS */}
                            <div className={cardClass}>
                                <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest mb-4 md:mb-6">Extrato Fixo Mensal</h2>
                                <div className="space-y-1">
                                    {fixosAtuais.map((fixo, index) => (
                                        <div key={index} className="group flex justify-between items-center py-3 md:py-4 border-b border-gray-800/50 hover:bg-[#1a2133] rounded-xl px-2 md:px-4 transition-colors gap-3">
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <p className="font-extrabold text-xs md:text-sm text-gray-200 truncate">{fixo.descricao || fixo.nome}</p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="text-[9px] md:text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded uppercase truncate max-w-[120px]">{fixo.categoria?.nome || fixo.categoria?.category_name || 'Geral'}</span>
                                                    <span className="text-[10px] md:text-[11px] font-medium text-gray-500 shrink-0">Dia {fixo.diaVencimento || fixo.data}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-6 shrink-0">
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="font-bold text-white text-sm md:text-base">- {formatarMoeda((fixo.valorCentavos / 100) || fixo.valor || 0)}</p>
                                                </div>
                                                {/* BOTÃO DO LÁPIS AQUI */}
                                                <button onClick={() => abrirModalEditarFixo(fixo)} className="text-gray-600 hover:text-indigo-500 md:opacity-0 group-hover:opacity-100 transition-all p-2" title="Editar Gasto Fixo">{iconeLapis}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 md:mt-6 pt-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <button disabled={paginaFixos === 1} onClick={() => setPaginaFixos(p => p - 1)} className="hover:text-sky-400 disabled:opacity-50 px-3 py-1.5">Anterior</button>
                                    <span>Pág {paginaFixos}</span>
                                    <button disabled={gastosFixos.length <= paginaFixos * itensPorPagina} onClick={() => setPaginaFixos(p => p + 1)} className="hover:text-sky-400 disabled:opacity-50 px-3 py-1.5">Próxima</button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            <div className={cardClass}>
                                <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest mb-4 md:mb-6">Detalhamento de Gastos</h2>
                                {resumoCategorias.length === 0 ? (
                                    <p className="text-gray-500 text-xs md:text-sm">Sem dados suficientes.</p>
                                ) : (
                                    <div className="space-y-5 md:space-y-6">
                                        {resumoCategorias.map((cat, index) => {
                                            const porcentagem = Math.round((cat.total / totalDespesasParaPorcentagem) * 100);
                                            const bgColors = ['bg-sky-500', 'bg-indigo-500', 'bg-fuchsia-500', 'bg-orange-500', 'bg-teal-500'];
                                            const corAtual = bgColors[index % bgColors.length];

                                            return (
                                                <div key={index}>
                                                    <div className="flex justify-between items-end mb-1 md:mb-2 gap-3">
                                                        <span className="text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-wider truncate flex-1">{cat.nome}</span>
                                                        <div className="text-right shrink-0 min-w-[50px]">
                                                            <span className="text-xs md:text-sm font-black text-white block">{formatarMoeda(cat.total)}</span>
                                                            <span className="text-[9px] md:text-[10px] font-bold text-gray-500">{porcentagem}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-[#0b0f19] rounded-full h-2 md:h-2.5 overflow-hidden border border-gray-800/50">
                                                        <div className={`${corAtual} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${porcentagem}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {/* TABELA DE HISTÓRICO DE RENDAS */}
                            <div className={cardClass}>
                                <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest mb-4 md:mb-6">Histórico de Entradas</h2>
                                <div className="space-y-1">
                                    {rendasAtuais.length === 0 ? (
                                        <p className="text-gray-500 text-xs py-2">Nenhuma renda registrada.</p>
                                    ) : (
                                        rendasAtuais.map((renda, index) => (
                                            <div key={index} className="group flex justify-between items-center py-3 border-b border-gray-800/50 hover:bg-[#1a2133] rounded-xl px-2 transition-colors gap-3">
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <p className="font-extrabold text-xs text-gray-200 truncate">{renda.descricao || 'Entrada'}</p>
                                                    <span className="text-[10px] font-medium text-gray-500">{formatarData(renda.dataRecebimento)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                                    <p className="font-bold text-emerald-400 text-sm md:text-base">+ {formatarMoeda((renda.valorCentavos || 0) / 100)}</p>
                                                    <button onClick={() => abrirModalEditarRenda(renda)} className="text-gray-600 hover:text-emerald-500 md:opacity-0 group-hover:opacity-100 transition-all p-2" title="Editar Renda">{iconeLapis}</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {rendasOrdenadas.length > 0 && (
                                    <div className="flex justify-between items-center mt-4 md:mt-6 pt-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <button disabled={paginaRendas === 1} onClick={() => setPaginaRendas(p => p - 1)} className="hover:text-emerald-400 disabled:opacity-50 px-3 py-1.5 transition-colors">Anterior</button>
                                        <span>Pág {paginaRendas}</span>
                                        <button disabled={rendasOrdenadas.length <= paginaRendas * itensPorPagina} onClick={() => setPaginaRendas(p => p + 1)} className="hover:text-emerald-400 disabled:opacity-50 px-3 py-1.5 transition-colors">Próxima</button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* ======================================================================= */}
            {/* MODAIS DE CADASTRO */}
            {/* ======================================================================= */}

            {isModalRendaOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 sm:p-4 z-[60] transition-opacity backdrop-blur-sm" onClick={() => setIsModalRendaOpen(false)}>
                    <div className={`${cardClass} w-full max-w-xl border-emerald-500/30 shadow-emerald-900/20`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-black text-emerald-400 uppercase tracking-wider">Registrar Renda</h2>
                        </div>
                        <form onSubmit={handleCadastrarRenda} className="space-y-4 md:space-y-5">
                            <div>
                                <label className={labelClass}>Origem da Renda</label>
                                <input type="text" value={novaRenda.descricao} onChange={(e) => setNovaRenda({...novaRenda, descricao: e.target.value})} className={inputClass} placeholder="Ex: Salário" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Valor (R$)</label><input type="text" value={novaRenda.valorReais} onChange={(e) => setNovaRenda({...novaRenda, valorReais: e.target.value})} className={inputClass} placeholder="Ex: 5000,00" required /></div>
                                <div><label className={labelClass}>Data de Recebimento</label><input type="date" value={novaRenda.dataRecebimento} onChange={(e) => setNovaRenda({...novaRenda, dataRecebimento: e.target.value})} className={inputClass} required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8 pt-4 border-t border-gray-800/50">
                                <button type="button" onClick={() => setIsModalRendaOpen(false)} className="w-full px-4 py-3 font-bold text-gray-400 bg-transparent border border-gray-800 rounded-full hover:bg-gray-800 uppercase text-[10px]">Cancelar</button>
                                <button type="submit" disabled={enviandoRenda} className="w-full px-4 py-3 font-black text-white bg-emerald-600 rounded-full hover:bg-emerald-500 uppercase text-[10px]">{enviandoRenda ? '...' : 'Salvar Entrada'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 sm:p-4 z-[60] transition-opacity backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className={`${cardClass} w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6 md:mb-8"><h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Registrar Gasto</h2></div>
                        <form onSubmit={handleCadastrarDespesa} className="space-y-4 md:space-y-5">
                            <div><label className={labelClass}>Descrição</label><input type="text" value={novaDespesa.descricao} onChange={(e) => setNovaDespesa({...novaDespesa, descricao: e.target.value})} className={inputClass} placeholder="Ex: Mercado Semanal" required /></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Valor (R$)</label><input type="text" value={novaDespesa.valorReais} onChange={(e) => setNovaDespesa({...novaDespesa, valorReais: e.target.value})} className={inputClass} placeholder="Ex: 150,00" required /></div>
                                <div><label className={labelClass}>Data</label><input type="date" value={novaDespesa.dataDespesa} onChange={(e) => setNovaDespesa({...novaDespesa, dataDespesa: e.target.value})} className={inputClass} required /></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className={labelClass}>Categoria</label><div className="flex gap-2"><select value={novaDespesa.idCategoria} onChange={(e) => setNovaDespesa({...novaDespesa, idCategoria: e.target.value})} className={`${inputClass} appearance-none flex-grow custom-scrollbar`}><optgroup label="SISTEMA" className="text-sky-400">{categorias.filter(c => c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup><optgroup label="PESSOAL" className="text-fuchsia-400">{categorias.filter(c => !c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup></select><button type="button" onClick={handleCriarCategoria} className="bg-[#1a2133] border border-gray-800 text-white font-bold rounded-xl px-4 hover:bg-sky-500 shrink-0">+</button></div></div>
                                <div><label className={labelClass}>Pagamento</label><select value={novaDespesa.metodoPagamento} onChange={(e) => setNovaDespesa({...novaDespesa, metodoPagamento: e.target.value})} className={`${inputClass} appearance-none`}><option value="PIX">PIX</option><option value="DEBITO">DÉBITO</option><option value="CREDITO">CRÉDITO</option><option value="DINHEIRO">DINHEIRO</option></select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-800/50">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-3 font-bold text-gray-400 border border-gray-800 rounded-full hover:bg-gray-800 text-[10px] uppercase">Cancelar</button>
                                <button type="submit" disabled={enviandoForm} className="w-full py-3 font-black text-white bg-sky-500 rounded-full hover:bg-sky-400 text-[10px] uppercase">{enviandoForm ? '...' : 'Salvar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isModalFixoOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 sm:p-4 z-[60] transition-opacity backdrop-blur-sm" onClick={() => setIsModalFixoOpen(false)}>
                    <div className={`${cardClass} w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">Gasto Fixo</h2>
                        </div>
                        <form onSubmit={handleCadastrarGastoFixo} className="space-y-4">

                            <div>
                                <label className={labelClass}>Descrição</label>
                                <input type="text" value={novoGastoFixo.descricao} onChange={(e) => setNovoGastoFixo({...novoGastoFixo, descricao: e.target.value})} className={inputClass} placeholder="Ex: Aluguel" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Valor</label><input type="text" value={novoGastoFixo.valorReais} onChange={(e) => setNovoGastoFixo({...novoGastoFixo, valorReais: e.target.value})} className={inputClass} placeholder="Ex: 1500,00" required /></div>
                                <div><label className={labelClass}>Dia Venc.</label><input type="number" min="1" max="31" value={novoGastoFixo.diaVencimento} onChange={(e) => setNovoGastoFixo({...novoGastoFixo, diaVencimento: e.target.value})} className={inputClass} placeholder="Ex: 10" required /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Categoria</label>
                                    <div className="flex gap-2">
                                        <select value={novoGastoFixo.idCategoria} onChange={(e) => setNovoGastoFixo({...novoGastoFixo, idCategoria: e.target.value})} className={`${inputClass} appearance-none flex-grow`}>
                                            <option value="" disabled hidden>Selecione...</option>
                                            <optgroup label="SISTEMA" className="text-sky-400">{categorias.filter(c => c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup>
                                            <optgroup label="PESSOAL" className="text-fuchsia-400">{categorias.filter(c => !c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup>
                                        </select>
                                        <button type="button" onClick={handleCriarCategoria} className="bg-[#1a2133] border border-gray-800 text-white font-bold rounded-xl px-4 hover:bg-sky-500 shrink-0">+</button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Pagamento</label>
                                    <select value={novoGastoFixo.metodoPagamento} onChange={(e) => setNovoGastoFixo({...novoGastoFixo, metodoPagamento: e.target.value})} className={`${inputClass} appearance-none`}>
                                        <option value="PIX">PIX</option><option value="DEBITO">DÉBITO</option><option value="CREDITO">CRÉDITO</option><option value="DINHEIRO">DINHEIRO</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-800/50">
                                <button type="button" onClick={() => setIsModalFixoOpen(false)} className="w-full py-3 font-bold text-gray-400 border border-gray-800 rounded-full hover:bg-gray-800 text-[10px] uppercase">Cancelar</button>
                                <button type="submit" disabled={enviandoFixo} className="w-full py-3 font-black text-white bg-sky-500 rounded-full hover:bg-sky-400 text-[10px] uppercase">Salvar</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {isModalCategoriasOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 sm:p-4 z-[60] transition-opacity backdrop-blur-sm" onClick={() => setIsModalCategoriasOpen(false)}>
                    <div className={`${cardClass} w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6 md:mb-8"><h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Categorias</h2></div>
                        <div className="max-h-64 overflow-y-auto pr-2 space-y-2 md:space-y-3 custom-scrollbar">
                            {categorias.map(cat => (
                                <div key={cat.id} className="flex justify-between items-center bg-[#0b0f19] border border-gray-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl gap-3 transition-colors hover:border-gray-700">
                                    <span className="text-white font-bold text-xs md:text-sm truncate flex-1 min-w-0">{cat.nome || cat.category_name}</span>
                                    {cat.isGlobal ? (
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest shrink-0 border border-gray-800 px-2 py-0.5 rounded-md">🔒 Sist.</span>
                                    ) : (
                                        <button onClick={() => handleExcluirCategoria(cat.id, cat.nome || cat.category_name)} className="text-gray-500 hover:text-red-500 shrink-0 p-2" title="Apagar Categoria">🗑</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 md:mt-8 pt-5 border-t border-gray-800/50 flex gap-3">
                            <button onClick={handleCriarCategoria} className="flex-1 px-3 py-3 font-black text-sky-400 bg-[#1a2133] border border-sky-500/20 rounded-xl hover:bg-sky-500 hover:text-white uppercase text-[10px] shadow-lg">+ NOVA</button>
                            <button onClick={() => setIsModalCategoriasOpen(false)} className="flex-1 px-3 py-3 font-black text-white bg-gray-800 rounded-xl hover:bg-gray-700 uppercase text-[10px]">FECHAR</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================================= */}
            {/* MODAIS DE EDIÇÃO */}
            {/* ======================================================================= */}

            {isModalEditarDespesaOpen && despesaEmEdicao && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 sm:p-4 z-[70] transition-opacity backdrop-blur-sm" onClick={() => setIsModalEditarDespesaOpen(false)}>
                    <div className={`${cardClass} w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6"><h2 className="text-xl font-black text-white uppercase tracking-wider">Editar Gasto</h2></div>
                        <form onSubmit={handleAtualizarDespesa} className="space-y-4">
                            <div><label className={labelClass}>Descrição</label><input type="text" value={despesaEmEdicao.descricao} onChange={(e) => setDespesaEmEdicao({...despesaEmEdicao, descricao: e.target.value})} className={inputClass} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Valor (R$)</label><input type="text" value={despesaEmEdicao.valorReais} onChange={(e) => setDespesaEmEdicao({...despesaEmEdicao, valorReais: e.target.value})} className={inputClass} required /></div>
                                <div><label className={labelClass}>Data</label><input type="date" value={despesaEmEdicao.dataDespesa} onChange={(e) => setDespesaEmEdicao({...despesaEmEdicao, dataDespesa: e.target.value})} className={inputClass} required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Categoria</label>
                                    <select value={despesaEmEdicao.idCategoria} onChange={(e) => setDespesaEmEdicao({...despesaEmEdicao, idCategoria: e.target.value})} className={`${inputClass} appearance-none`}>
                                        <optgroup label="SISTEMA" className="text-sky-400">{categorias.filter(c => c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup>
                                        <optgroup label="PESSOAL" className="text-fuchsia-400">{categorias.filter(c => !c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Pagamento</label>
                                    <select value={despesaEmEdicao.metodoPagamento} onChange={(e) => setDespesaEmEdicao({...despesaEmEdicao, metodoPagamento: e.target.value})} className={`${inputClass} appearance-none`}>
                                        <option value="PIX">PIX</option><option value="DEBITO">DÉBITO</option><option value="CREDITO">CRÉDITO</option><option value="DINHEIRO">DINHEIRO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-800/50">
                                <button type="button" onClick={() => setIsModalEditarDespesaOpen(false)} className="w-full py-3 font-bold text-gray-400 border border-gray-800 rounded-xl hover:bg-gray-800 text-[10px] uppercase">Cancelar</button>
                                <button type="button" onClick={handleApagarDespesaEdicao} className="w-full py-3 font-black text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white text-[10px] uppercase">Apagar</button>
                                <button type="submit" className="w-full py-3 font-black text-white bg-sky-500 rounded-xl hover:bg-sky-400 text-[10px] uppercase">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isModalEditarFixoOpen && fixoEmEdicao && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 sm:p-4 z-[70] transition-opacity backdrop-blur-sm" onClick={() => setIsModalEditarFixoOpen(false)}>
                    <div className={`${cardClass} w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6"><h2 className="text-xl font-black text-white uppercase tracking-wider">Editar Fixo</h2></div>
                        <form onSubmit={handleAtualizarFixo} className="space-y-4">
                            <div><label className={labelClass}>Descrição</label><input type="text" value={fixoEmEdicao.descricao} onChange={(e) => setFixoEmEdicao({...fixoEmEdicao, descricao: e.target.value})} className={inputClass} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Valor (R$)</label><input type="text" value={fixoEmEdicao.valorReais} onChange={(e) => setFixoEmEdicao({...fixoEmEdicao, valorReais: e.target.value})} className={inputClass} required /></div>
                                <div><label className={labelClass}>Dia Venc.</label><input type="number" min="1" max="31" value={fixoEmEdicao.diaVencimento} onChange={(e) => setFixoEmEdicao({...fixoEmEdicao, diaVencimento: e.target.value})} className={inputClass} required /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Categoria</label>
                                    <select value={fixoEmEdicao.idCategoria} onChange={(e) => setFixoEmEdicao({...fixoEmEdicao, idCategoria: e.target.value})} className={`${inputClass} appearance-none`}>
                                        <optgroup label="SISTEMA" className="text-sky-400">{categorias.filter(c => c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup>
                                        <optgroup label="PESSOAL" className="text-fuchsia-400">{categorias.filter(c => !c.isGlobal).map(c => <option key={c.id} value={c.id} className="text-white">{c.nome || c.category_name}</option>)}</optgroup>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Pagamento</label>
                                    <select value={fixoEmEdicao.metodoPagamento} onChange={(e) => setFixoEmEdicao({...fixoEmEdicao, metodoPagamento: e.target.value})} className={`${inputClass} appearance-none`}>
                                        <option value="PIX">PIX</option><option value="DEBITO">DÉBITO</option><option value="CREDITO">CRÉDITO</option><option value="DINHEIRO">DINHEIRO</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-800/50">
                                <button type="button" onClick={() => setIsModalEditarFixoOpen(false)} className="w-full py-3 font-bold text-gray-400 border border-gray-800 rounded-xl hover:bg-gray-800 text-[10px] uppercase">Cancelar</button>
                                <button type="button" onClick={handleApagarFixoEdicao} className="w-full py-3 font-black text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white text-[10px] uppercase">Apagar</button>
                                <button type="submit" className="w-full py-3 font-black text-white bg-indigo-500 rounded-xl hover:bg-indigo-400 text-[10px] uppercase">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isModalEditarRendaOpen && rendaEmEdicao && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 sm:p-4 z-[70] transition-opacity backdrop-blur-sm" onClick={() => setIsModalEditarRendaOpen(false)}>
                    <div className={`${cardClass} w-full max-w-xl border-emerald-500/30 shadow-emerald-900/20`} onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6"><h2 className="text-xl font-black text-emerald-400 uppercase tracking-wider">Editar Renda</h2></div>
                        <form onSubmit={handleAtualizarRenda} className="space-y-4">
                            <div><label className={labelClass}>Descrição</label><input type="text" value={rendaEmEdicao.descricao} onChange={(e) => setRendaEmEdicao({...rendaEmEdicao, descricao: e.target.value})} className={inputClass} required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Valor (R$)</label><input type="text" value={rendaEmEdicao.valorReais} onChange={(e) => setRendaEmEdicao({...rendaEmEdicao, valorReais: e.target.value})} className={inputClass} required /></div>
                                <div><label className={labelClass}>Data</label><input type="date" value={rendaEmEdicao.dataRecebimento} onChange={(e) => setRendaEmEdicao({...rendaEmEdicao, dataRecebimento: e.target.value})} className={inputClass} required /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-800/50">
                                <button type="button" onClick={() => setIsModalEditarRendaOpen(false)} className="w-full py-3 font-bold text-gray-400 border border-gray-800 rounded-xl hover:bg-gray-800 text-[10px] uppercase">Cancelar</button>
                                <button type="button" onClick={handleApagarRendaEdicao} className="w-full py-3 font-black text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white text-[10px] uppercase">Apagar</button>
                                <button type="submit" className="w-full py-3 font-black text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 text-[10px] uppercase">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ======================================================================= */}
            {/* TOAST DE NOTIFICAÇÃO */}
            {/* ======================================================================= */}
            {notificacao.visivel && (
                <div className={`fixed top-4 right-4 md:top-10 md:right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 flex items-center gap-3 border backdrop-blur-md ${
                    notificacao.tipo === 'sucesso'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    <span className="text-xl">{notificacao.tipo === 'sucesso' ? '✅' : '❌'}</span>
                    <p className="font-bold text-sm tracking-wide uppercase">{notificacao.mensagem}</p>
                </div>
            )}

        </div>
    );
}