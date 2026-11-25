import { Link } from "react-router-dom";

const features = [
  { icon: "✦", title: "עוזר למידה אישי", description: "שאלו שאלות, בקשו הסברים וקבלו עזרה בלמידה בעזרת AI.", status: "זמין עכשיו", active: true },
  { icon: "▤", title: "קורסים ומטלות", description: "כל חומרי הלימוד והמשימות שלכם במקום אחד.", status: "בקרוב" },
  { icon: "◷", title: "מעקב התקדמות", description: "עקבו אחר ההתקדמות והיעדים הלימודיים שלכם.", status: "בקרוב" },
];

export default function HomePage() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> סביבת הלמידה שלך</span>
          <h1>הלמידה שלך.<br /><span>בדרך חכמה יותר.</span></h1>
          <p>ברוכים הבאים ל־LEV Smart – המקום שבו כלים חכמים עוזרים לכם ללמוד, להתארגן ולהתקדם.</p>
          <Link to="/chat" className="primary-button"><span>מתחילים לדבר עם עוזר ה־AI</span><span>←</span></Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="hero-glow"><span className="hero-spark">✦</span><span className="hero-book">▤</span><span className="hero-small-spark">✧</span></div>
          <div className="floating-card floating-card-top">✦ למידה חכמה</div>
          <div className="floating-card floating-card-bottom">הצעד הבא שלך מתחיל כאן</div>
        </div>
      </section>
      <section className="section-heading">
        <div><span className="eyebrow">הכלים שלך</span><h2>מה תרצו לעשות היום?</h2></div>
        <span className="section-caption">היכולות של LEV Smart</span>
      </section>
      <section className="feature-grid">
        {features.map((feature) => (
          <article className={`feature-card ${feature.active ? "feature-ai" : ""}`} key={feature.title}>
            <div className="feature-card-top">
              <span className="feature-icon">{feature.icon}</span>
              <span className={feature.active ? "status status-live" : "status"}>{feature.status}</span>
            </div>
            <h3>{feature.title}</h3><p>{feature.description}</p>
            {feature.active ? <Link to="/chat" className="text-link">כניסה לעוזר AI <span>←</span></Link> : <span className="coming-soon">נוסיף בהמשך</span>}
          </article>
        ))}
      </section>
      <section className="home-tip">
        <span className="tip-icon">✧</span>
        <div><strong>טיפ קטן להתחלה</strong><p>אפשר לבקש מעוזר ה־AI להסביר נושא, לתת דוגמאות או לעזור להבין שאלה.</p></div>
        <Link to="/chat" className="tip-link">נסו עכשיו ←</Link>
      </section>
    </div>
  );
}
