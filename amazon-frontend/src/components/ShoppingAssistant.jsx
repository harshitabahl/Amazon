
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Bot, User, ShoppingBag } from "lucide-react";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";
import "./ShoppingAssistant.css";


const CHAT_API = "http://localhost:3001/api/chat";
const IMAGE_API = "https://amazon-7t4h.onrender.com";

function ShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm ShopSphere's AI Shopping Assistant. What are you looking for today?",
      products: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [previousProductIds, setPreviousProductIds] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getImage = (product) => {
    const img = product?.img;

    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }

    if (typeof img === "string" && img.startsWith("/uploads")) {
      return `${IMAGE_API}${img}`;
    }

    return getPlaceholderImage(product?.title || "");
  };

  const sendMessage = async (e) => {
    e?.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: message, products: [] }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const conversationHistory = updatedMessages
      .slice(-10)
      .map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch(CHAT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.slice(0, -1),
          previousProductIds
        })
      });

      const data = await response.json();
        console.log("SHOPPING ASSISTANT API RESPONSE:", data);
        console.log("PRODUCTS RECEIVED:", data.products);

      if (!response.ok) {
        throw new Error(data.message || "Unable to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I couldn't generate a response.",
          products: data.products || []
        }
      ]);

      setPreviousProductIds(data.productIds || []);
    } catch (error) {
      console.error("Shopping Assistant Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm unable to connect right now. Please try again.",
          products: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openProduct = (id) => {
    if (!id) return;
    setIsOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <>
      <button
        className="assistant-floating-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open shopping assistant"
      >
        {isOpen ? <X size={25} /> : <MessageCircle size={25} />}
      </button>

      {isOpen && (
        <div className="assistant-window">
          <div className="assistant-header">
            <div className="assistant-header-info">
              <div className="assistant-avatar">
                <Bot size={23} />
              </div>
              <div>
                <h3>ShopSphere Assistant</h3>
                <span>AI Shopping Assistant</span>
              </div>
            </div>

            <button
              className="assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={21} />
            </button>
          </div>

          <div className="assistant-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`assistant-message-row ${
                  msg.role === "user" ? "user-row" : "bot-row"
                }`}
              >
                <div className="assistant-message-avatar">
                  {msg.role === "user" ? (
                    <User size={17} />
                  ) : (
                    <Bot size={17} />
                  )}
                </div>

                <div className="assistant-message-content">
                  <div className="assistant-message-bubble">
                    {msg.content}
                  </div>

                  {msg.products?.length > 0 && (
                    <div className="assistant-products">
                      {msg.products.map((product) => (
                        <button
                          key={product.id}
                          className="assistant-product-card"
                          onClick={() => openProduct(product.id)}
                        >
                          <img
                            src={getImage(product)}
                            alt={product.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getPlaceholderImage(
                                product.title || ""
                              );
                            }}
                          />

                          <div className="assistant-product-info">
                            <strong>{product.brand || "ShopSphere"}</strong>
                            <p>{product.title}</p>
                            <span>
                              ₹{Number(product.price || 0).toLocaleString("en-IN")}
                            </span>
                            <small>
                              <ShoppingBag size={12} /> View product
                            </small>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="assistant-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="assistant-input-area" onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me about products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>

          <div className="assistant-footer">
            Powered by ShopSphere AI
          </div>
        </div>
      )}
    </>
  );
}

export default ShoppingAssistant;
