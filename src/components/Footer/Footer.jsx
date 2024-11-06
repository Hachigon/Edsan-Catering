import React from 'react';
import Facebooklogo from '../../assets/facebook.png';

const Footer = () => {
  return (
    <footer className="bg-white/20 md:px-16 lg:pl-20 py-16" id="footer-about">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-52 justify-center">
        {/* About Us Section */}
        <div>
          <h1 className="text-3xl font-semibold text-black mb-4">
            About Us
          </h1>
          <p className="text-black leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum ipsum nam soluta dolorem? Dolores molestiae reiciendis mollitia, assumenda, nemo hic quos ex recusandae quam eum numquam veritatis culpa expedita harum.
          </p>
        </div>
        {/* Follow Us Section */}
        <div>
          <h1 className="text-3xl text-black font-semibold mb-4">
            Follow Us
          </h1>
          <ul className="flex space-x-4 items-center">
            <img src={Facebooklogo} alt="Facebook" className="w-10 h-10" />
            <li>
              <a href="https://www.facebook.com/edsancatering" className="flex justify-center text-lg text-black items-center space-x-2 hover:border-b-2 border-blue-900 transition-colors">
                <span>Facebook</span>
              </a>
            </li>
          </ul>
        </div>
        {/*Contact Section*/}
        <div>
          <h1 className="text-3xl font-semibold justify-center text-black mb-2">
            Contacts
          </h1>
          <p className="text-black text-2xl leading-relaxed">
            Katherine Santos
          </p>
          <p className="text-black text-md justify-center items-center leading-relaxed hover:scale-110 transition duration-300">
            +63 915 222 1107
          </p>
          <p className="text-black text-md items-center leading-relaxed hover:scale-110 transition duration-300">
            +63 932 926 7721
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
