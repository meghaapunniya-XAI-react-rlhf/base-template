// App.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";

const App = () => {
  const [userInfo, setUserInfo] = useState({
    name: '', workExperiences: [], email: '', phone: '', blogTitle: '', blogContent: [], coverPhoto: ''
  });
  const [currentPage, setCurrentPage] = useState('Blog');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({...prev, [name]: value}));
  };

  const addExperience = () => {
    setUserInfo(prev => ({
      ...prev, 
      workExperiences: [...prev.workExperiences, { role: '', description: '' }]
    }));
  };

  const updateExperience = (index, field, value) => {
    let experiences = [...userInfo.workExperiences];
    experiences[index][field] = value;
    setUserInfo({...userInfo, workExperiences: experiences});
  };

  const addContent = (type) => {
    setUserInfo(prev => ({
      ...prev,
      blogContent: [...prev.blogContent, { type: type, content: '' }]
    }));
  };

  const updateContent = (index, content) => {
    let contentList = [...userInfo.blogContent];
    contentList[index].content = content;
    setUserInfo({...userInfo, blogContent: contentList});
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'About': return <AboutPage {...userInfo} />;
      case 'Blog': return <BlogPage blogContent={userInfo.blogContent} />;
      case 'Contact': return <ContactPage {...userInfo} />;
      default: return <BlogPage blogContent={userInfo.blogContent} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar setCurrentPage={setCurrentPage} />
      <div className="container mx-auto px-4 py-8">
        {currentPage === 'Blog' ? renderPage() : (
          <div className="space-y-4">
            <Input name="name" value={userInfo.name} onChange={handleInputChange} placeholder="Your Name" />
            <Input name="email" value={userInfo.email} onChange={handleInputChange} placeholder="Email" />
            <Input name="phone" value={userInfo.phone} onChange={handleInputChange} placeholder="Phone" />
            <Input name="blogTitle" value={userInfo.blogTitle} onChange={handleInputChange} placeholder="Blog Title" />
            <Input name="coverPhoto" value={userInfo.coverPhoto} onChange={handleInputChange} placeholder="Cover Photo URL" />
            {userInfo.workExperiences.map((exp, idx) => (
              <div key={idx} className="p-4 bg-white rounded shadow">
                <Input value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} placeholder="Job Role" />
                <Textarea value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} placeholder="Description" />
              </div>
            ))}
            <Button onClick={addExperience}>Add Experience</Button>
            {['text', 'image', 'video'].map(type => (
              <Button key={type} onClick={() => addContent(type)} className="mt-2">
                Add {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
            {userInfo.blogContent.map((item, idx) => (
              <Textarea key={idx} value={item.content} onChange={(e) => updateContent(idx, e.target.value)} placeholder={`Enter ${item.type} URL or Text`} />
            ))}
            <Button onClick={() => setCurrentPage('Blog')}>View Blog</Button>
          </div>
        )}
        {currentPage !== 'Blog' && renderPage()}
      </div>
    </div>
  );
};

export default App;

// components/Navbar.jsx
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";

// const Navbar = ({ setCurrentPage }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow">
//       <div className="container mx-auto flex justify-between items-center p-4">
//         <div className="text-xl font-bold">My Blog</div>
//         <div className="hidden sm:flex space-x-4">
//           {['About', 'Blog', 'Contact'].map(page => (
//             <Button key={page} onClick={() => setCurrentPage(page)}>{page}</Button>
//           ))}
//         </div>
//         <div className="sm:hidden">
//           <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? '✕' : '☰'}</Button>
//         </div>
//         {isOpen && (
//           <div className="sm:hidden flex flex-col mt-4">
//             {['About', 'Blog', 'Contact'].map(page => (
//               <Button key={page} onClick={() => { setCurrentPage(page); setIsOpen(false); }} className="mb-2">
//                 {page}
//               </Button>
//             ))}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// // components/AboutPage.jsx, BlogPage.jsx, ContactPage.jsx would follow similar patterns for content display