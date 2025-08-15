export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh',fontFamily:'sans-serif',padding:'2rem'}}>
          <h1 style={{fontSize:'2rem',fontWeight:600}}>Page Not Found</h1>
          <p style={{marginTop:'0.75rem',opacity:0.7}}>The page you were looking for does not exist.</p>
        </main>
      </body>
    </html>
  );
}
