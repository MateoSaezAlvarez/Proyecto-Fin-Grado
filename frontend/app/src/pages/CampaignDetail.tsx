import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import DmRollNotificationModal from '../components/DmRollNotificationModal';
import type { RollNotification } from '../components/DmRollNotificationModal';

const POLL_MS = 5000;

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<any>(null);
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // DM notification state
    const [rollNotification, setRollNotification] = useState<RollNotification | null>(null);
    const lastSeenId = useRef<number | null>(null);
    const pollTimer  = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Fetch campaign + characters ──────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            if (!id) return;
            try {
                const cid = parseInt(id, 10);
                const [camp, chars] = await Promise.all([
                    api.getCampaign(cid),
                    api.getCampaignCharacters(cid),
                ]);
                setCampaign(camp);
                setCharacters(chars);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // ── Poll for new rolls (DM only) ──────────────────────────────────────
    useEffect(() => {
        if (!campaign?.isDm || !id) return;

        const campaignId = parseInt(id, 10);

        const poll = async () => {
            try {
                const rolls: RollNotification[] = await api.getCampaignRolls(campaignId);
                if (!rolls || rolls.length === 0) return;

                const latest = rolls[0]; // sorted DESC by date

                if (lastSeenId.current === null) {
                    // First poll: just mark seen, don't flash a modal for old rolls
                    lastSeenId.current = latest.id;
                } else if (latest.id !== lastSeenId.current) {
                    lastSeenId.current = latest.id;
                    setRollNotification(latest);
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        };

        poll(); // immediate first run
        pollTimer.current = setInterval(poll, POLL_MS);
        return () => { if (pollTimer.current) clearInterval(pollTimer.current); };
    }, [campaign?.isDm, id]);

    // ─────────────────────────────────────────────────────────────────────
    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Cargando detalles de la campaña...</div>;
    if (!campaign) return <div style={{ padding: '2rem', color: 'white' }}>Campaña no encontrada</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    <div
                        style={{
                            width: '200px',
                            height: '120px',
                            borderRadius: '8px',
                            backgroundImage: `url(${campaign.imageUrl || 'https://via.placeholder.com/300x150?text=Campaign'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div>
                        <h1 style={{ color: 'var(--accent-color)', fontFamily: 'Cinzel, serif', margin: 0 }}>
                            {campaign.name}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            {campaign.gameSystem} - {campaign.status}
                        </p>
                        <p style={{ marginTop: '1rem', maxWidth: '600px' }}>
                            {campaign.description || 'No hay descripción en el archivo.'}
                        </p>

                        {/* DM live-listening badge */}
                        {campaign.isDm && (
                            <div style={{
                                marginTop: '0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'var(--accent-color)',
                                border: '1px solid var(--accent-color)',
                                borderRadius: '20px',
                                padding: '0.2rem 0.75rem',
                            }}>
                                <span style={{
                                    width: '7px', height: '7px',
                                    borderRadius: '50%',
                                    background: 'var(--success-color)',
                                    display: 'inline-block',
                                    animation: 'dmPulse 2s ease-in-out infinite',
                                }} />
                                Escuchando tiradas de los jugadores…
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <section>
                <h2 style={{
                    fontFamily: 'Cinzel, serif',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '0.5rem',
                    marginBottom: '1.5rem',
                }}>
                    Aventureros
                </h2>

                {characters.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)' }}>
                        Ningún aventurero se ha unido a esta campaña.
                    </div>
                ) : (
                    <div className="grid-cols-3">
                        {characters.map((char) => (
                            <div
                                key={char.id}
                                className="card"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/character/${char.id}`)}
                            >
                                <div style={{
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }} />
                                <h3>{char.name}</h3>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {char.classSubclass} - Nivel {char.level}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Jugador: {char.playerName || 'Unknown'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* DM roll notification modal */}
            <DmRollNotificationModal
                notification={rollNotification}
                onClose={() => setRollNotification(null)}
            />

            <style>{`
                @keyframes dmPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.3; transform: scale(0.85); }
                }
            `}</style>
        </div>
    );
};

export default CampaignDetail;
