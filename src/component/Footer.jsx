import React from 'react'
import { LuBrain } from "react-icons/lu";

const Footer = () => {
  return (
 <>
<footer className="w-full bg-[#2C2F33] text-white px-4 py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-300">
    {/* Lead Sparks */}
    <div>
      <h2 className="text-white font-semibold mb-3">Lead Sparks</h2>
      <ul className="space-y-2">
        <li>About Us</li>
        <li>Contact</li>
        <li>Blog</li>
        <li>Careers</li>
      </ul>
    </div>

    {/* Resources */}
    <div>
      <h2 className="text-white font-semibold mb-3">Resources</h2>
      <ul className="space-y-2">
        <li>Library</li>
        <li>Games</li>
        <li>AI Tools</li>
        <li>Mood Tracker</li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h2 className="text-white font-semibold mb-3">Support</h2>
      <ul className="space-y-2">
        <li>FAQs</li>
        <li>Community Guidelines</li>
        <li>Help Center</li>
        <li>Privacy Policy</li>
      </ul>
    </div>

    {/* Connect */}
    <div>
      <h2 className="text-white font-semibold mb-3">Connect</h2>
      <ul className="flex flex-wrap gap-4">
        <li>Instagram</li>
        <li>LinkedIn</li>
        <li>YouTube</li>
        <li className="text-gray-500">Discord</li>
      </ul>
    </div>
  </div>

  <div className="mt-8 text-center text-sm text-gray-500">
    © 2023 Lead Sparks. All rights reserved.
  </div>
</footer>
 
 </>
  )
}

export default Footer