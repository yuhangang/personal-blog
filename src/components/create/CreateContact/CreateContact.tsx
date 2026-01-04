'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './CreateContact.module.scss';
import MessyThreads from '../../common/MessyThreads/MessyThreads';

import Turnstile from '../../common/Turnstile/Turnstile';

export default function CreateContact() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [message, setMessage] = useState('');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<{
        title?: string;
        description?: string;
        image?: string;
        suggestion?: string;
        critique?: string;
        plan?: string[];
    } | null>(null);

    const handleUrlAnalyze = async (url: string) => {
        if (!url || url.length < 4) return;
        
        // Require Captcha
        if (!captchaToken) {
            alert("Please complete the verification check first.");
            return;
        }
        
        setIsAnalyzing(true);
        setAnalysis(null);
        
        try {
            const res = await fetch('/api/analyze-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, token: captchaToken })
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.title || data.suggestion) {
                    setAnalysis(data);
                }
            } else {
                 const errData = await res.json();
                 alert(errData.error || "Analysis failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };
    const [activeTab, setActiveTab] = useState<'smart' | 'manual'>('smart');

    // ... (keep handleUrlAnalyze)

    const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'agent', content: string}>>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !analysis) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsChatting(true);

        try {
            const res = await fetch('/api/agent-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentAnalysis: analysis,
                    userMessage: userMsg,
                    chatHistory: chatHistory
                })
            });

            if (res.ok) {
                const data = await res.json();
                
                // Add agent reply
                if (data.reply) {
                    setChatHistory(prev => [...prev, { role: 'agent', content: data.reply }]);
                }

                // Update analysis state if agent suggests changes
                setAnalysis(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        plan: data.updatedPlan || prev.plan,
                        suggestion: data.updatedSuggestion || prev.suggestion,
                        critique: data.updatedCritique || prev.critique
                    };
                });
            }
        } catch (err) {
            console.error("Chat failed", err);
        } finally {
            setIsChatting(false);
        }
    };

    const handleUseDraft = () => {
        if (analysis?.suggestion) {
            setMessage(analysis.suggestion);
            setActiveTab('manual'); // Switch to manual tab to finish
        }
    };

    return (
        <section className={styles.section} id="contact">
            <div className={styles.container}>
                {/* Left Column: Text */}
                <div className={styles.textColumn}>
                    <div className={styles.backgroundLayer}>
                        <MessyThreads />
                    </div>
                    <div>
                        <h2 className={styles.headline}>
                            Ready to <em>elevate</em> your brand?
                        </h2>
                        <p className={styles.subhead}>
                            {activeTab === 'smart' 
                                ? "Let our AI agent draft the perfect inquiry for you. Just drop your link." 
                                : "Tell us about your project. We're ready to listen."}
                        </p>
                    </div>

                    
                </div>

                {/* Right Column: Form */}
                <div className={styles.formColumn}>
                    <div className={styles.tabsHelpers}>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'smart' ? styles.active : ''}`}
                            onClick={() => setActiveTab('smart')}
                        >
                            Your Desire
                        </button>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'manual' ? styles.active : ''}`}
                            onClick={() => setActiveTab('manual')}
                        >
                            Contact
                        </button>
                    </div>

                    <form className={styles.formGrid}>
                        {activeTab === 'smart' ? (
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>Your Website / Social Link</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. yourwebsite.com"
                                    onBlur={(e) => handleUrlAnalyze(e.target.value)}
                                    autoFocus
                                    // Disable input until verified? optional
                                />

                                {/* Verification Widget */}
                                {!analysis && !isAnalyzing && (
                                    <div style={{ marginTop: '16px' }}>
                                        <Turnstile 
                                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                                            onVerify={(token) => setCaptchaToken(token)}
                                        />
                                    </div>
                                )}
                                
                                {isAnalyzing && <div className={styles.analyzing}>Agent is analyzing your brand...</div>}
                                
                                {analysis && (
                                    <div className={styles.agentCard}>
                                        <div className={styles.agentHeader}>
                                            <span className={styles.agentLabel}>STRATEGIC AUDIT</span>
                                            {analysis.image && <img src={analysis.image} alt="" className={styles.agentImage} />}
                                        </div>
                                        <p className={styles.agentTitle}>{analysis.title}</p>
                                        <p className={styles.agentDesc}>{analysis.description}</p>
                                        
                                        {analysis.critique && (
                                            <div className={styles.critiqueBox}>
                                                <span className={styles.verdictLabel}>VERDICT:</span>
                                                <p>"{analysis.critique}"</p>
                                            </div>
                                        )}

                                        {analysis.plan && (
                                            <div className={styles.planBox}>
                                                <span className={styles.planLabel}>GROWTH PLAN</span>
                                                <ul>
                                                    {analysis.plan.map((step, i) => (
                                                        <li key={i}>{step}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className={styles.suggestionBox}>
                                            <label>Drafted Inquiry:</label>
                                            <p>"{analysis.suggestion}"</p>
                                            <button 
                                                type="button" 
                                                className={styles.useBtn}
                                                onClick={handleUseDraft}
                                            >
                                                Use this Plan
                                            </button>
                                        </div>

                                        {/* CHAT INTERFACE */}
                                        <div className={styles.chatContainer}>
                                            <div className={styles.chatMessages}>
                                                {chatHistory.map((msg, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`${styles.chatBubble} ${msg.role === 'user' ? styles.user : styles.agent}`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                ))}
                                                {isChatting && <div className={`${styles.chatBubble} ${styles.agent}`}>Thinking...</div>}
                                            </div>
                                            <form onSubmit={handleSendMessage} className={styles.chatInputGroup}>
                                                <input 
                                                    type="text" 
                                                    placeholder="Refine plan (e.g. 'Make it more punchy')" 
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    disabled={isChatting}
                                                />
                                                <button type="submit" disabled={!chatInput.trim() || isChatting}>
                                                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Your Name *</label>
                                    <input type="text" required />
                                </div>
        
                                <div className={styles.inputGroup}>
                                    <label>Email *</label>
                                    <input type="email" required />
                                </div>
        
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Your Business Name</label>
                                    <input type="text" />
                                </div>
        
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Message *</label>
                                    <textarea 
                                        rows={4} 
                                        required 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
        
                                <div className={styles.fullWidth}>
                                    <button type="submit" className={styles.submitBtn}>SEND</button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
