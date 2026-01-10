export default function Contact() {
  return (
    <div>
      <h1>Contact</h1>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={5} required></textarea>
        </div>
        
        <button type="submit">Send Message</button>
      </form>
      
      <section>
        <h2>Get in Touch</h2>
        <div>
          {/* Social links will be added here */}
        </div>
      </section>
    </div>
  )
}