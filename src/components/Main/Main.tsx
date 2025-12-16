import React, { useContext, useRef, ChangeEvent } from "react";
import "./Main.css";
import { Context } from "../../context/ContextApi";
import { assets } from "../../assets/assets";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../shared/CodeBlock";
import { Mermaid } from "../shared/Mermaid";

const Main: React.FC = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          // Append the base64 image to the input
          setInput(
            (prevInput: string) => `${prevInput}\n![image](${reader.result})`
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="main" style={{ backgroundColor: "#09090A" }}>
      <div className="nav">
        <p>Snapgram AI</p>
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming travel.</p>
                <img src={assets.compass_icon} />
              </div>
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming travel.</p>
                <img src={assets.bulb_icon} />
              </div>
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming travel.</p>
                <img src={assets.message_icon} />
              </div>
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming travel.</p>
                <img src={assets.code_icon} />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} />
              <p style={{ color: "white" }}>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div className="markdown-container">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const textContent = String(children).replace(/\n$/, '');

                        if (!inline && language === 'mermaid') {
                          return <Mermaid chart={textContent} />;
                        }

                        if (!inline && match) {
                          return (
                            <CodeBlock 
                              language={language} 
                              value={textContent} 
                            />
                          );
                        }

                        return (
                          <code className={className} style={{backgroundColor: '#1e293b', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace'}} {...props}>
                            {children}
                          </code>
                        );
                      },
                      p: ({node, ...props}) => <p style={{color: 'white', marginBottom: '1rem', lineHeight: '1.6'}} {...props} />,
                      ul: ({node, ...props}) => <ul style={{color: 'white', listStyleType: 'disc', marginLeft: '1.5rem', marginBottom: '1rem'}} {...props} />,
                      ol: ({node, ...props}) => <ol style={{color: 'white', listStyleType: 'decimal', marginLeft: '1.5rem', marginBottom: '1rem'}} {...props} />,
                      li: ({node, ...props}) => <li style={{color: 'white', marginBottom: '0.5rem'}} {...props} />,
                      h1: ({node, ...props}) => <h1 style={{color: 'white', fontSize: '2em', fontWeight: 'bold', marginBottom: '1rem', marginTop: '1.5rem'}} {...props} />,
                      h2: ({node, ...props}) => <h2 style={{color: 'white', fontSize: '1.5em', fontWeight: 'bold', marginBottom: '1rem', marginTop: '1.5rem'}} {...props} />,
                      h3: ({node, ...props}) => <h3 style={{color: 'white', fontSize: '1.17em', fontWeight: 'bold', marginBottom: '1rem', marginTop: '1rem'}} {...props} />,
                      strong: ({node, ...props}) => <strong style={{fontWeight: 'bold', color: '#e2e8f0'}} {...props} />,
                      table: ({node, ...props}) => <div style={{overflowX: 'auto', marginBottom: '1rem', border: '1px solid #475569', borderRadius: '8px'}}><table style={{borderCollapse: 'collapse', width: '100%', color: 'white'}} {...props} /></div>,
                      th: ({node, ...props}) => <th style={{borderBottom: '1px solid #475569', padding: '12px', backgroundColor: '#1e293b', textAlign: 'left', fontWeight: 'bold'}} {...props} />,
                      td: ({node, ...props}) => <td style={{borderBottom: '1px solid #475569', padding: '12px'}} {...props} />,
                      div: ({node, ...props}) => <div style={{ marginBottom: '1rem' }} {...props} />,
                      span: ({node, ...props}) => <span style={{ color: 'white' }} {...props} />,
                    }}
                  >
                    {resultData}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
              style={{ color: "black" }}
            />
            <div>
              <img
                src={assets.gallery_icon}
                alt=""
                onClick={openFilePicker}
                style={{ cursor: "pointer" }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <img src={assets.mic_icon} alt="" />
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Snapgram may display inaccurate info, take it into consideration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
