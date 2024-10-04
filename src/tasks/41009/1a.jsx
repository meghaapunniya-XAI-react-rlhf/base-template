import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    blogTitle: '',
    blogContent: '',
    workExperiences: [],
    coverPhoto: '',
    location: ''
  });
  const [currentPage, setCurrentPage] = useState('Blog');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    const experiences = [...formData.workExperiences];
    experiences[index][field] = value;
    setFormData({ ...formData, workExperiences: experiences });
  };

  const addExperience = () => {
    setFormData({ 
      ...formData, 
      workExperiences: [...formData.workExperiences, { role: '', description: '' }]
    });
  };

  const removeExperience = (index) => {
    const experiences = formData.workExperiences.filter((_, i) => i !== index);
    setFormData({ ...formData, workExperiences: experiences });
  };

  const NavBar = () => (
    <nav className="flex justify-between items-center bg-blue-500 text-white p-4">
      <div>Blog App</div>
      <div className="hidden sm:flex space-x-4">
        <Button variant="link" onClick={() => setCurrentPage('About')}>About</Button>
        <Button variant="link" onClick={() => setCurrentPage('Blog')}>Blog</Button>
        <Button variant="link" onClick={() => setCurrentPage('Contact')}>Contact</Button>
      </div>
      <div className="sm:hidden">
        <Button onClick={() => alert('Toggle menu')}>☰</Button>
      </div>
    </nav>
  );

  const AboutPage = () => (
    <div className="p-4">
      <Card className="max-w-sm mx-auto">
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={formData.coverPhoto} alt="Cover" className="w-full h-64 object-cover"/>
            </div>
            <div className="flip-card-back p-4 bg-white">
              <h2>{formData.name}</h2>
              <p>{formData.workExperiences[0]?.role || 'Job Role'}</p>
              <Button onClick={() => setCurrentPage('Contact')}>Contact Me</Button>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Work Experience</h2>
        {formData.workExperiences.map((exp, index) => (
          <Card key={index} className="mt-2">
            <CardHeader>
              <CardTitle>{exp.role}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const BlogPage = () => (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{formData.blogTitle}</h1>
      <div dangerouslySetInnerHTML={{ __html: formData.blogContent.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>') }}></div>
    </div>
  );

  const ContactPage = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold">Contact</h2>
      <p>Email: {formData.email}</p>
      <p>Phone: {formData.phone}</p>
      <p>Location: {formData.location}</p>
    </div>
  );

  const FormPage = () => (
    <div className="p-4">
      <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="mb-4"/>
      <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="mb-4"/>
      <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="mb-4"/>
      <Input name="blogTitle" value={formData.blogTitle} onChange={handleInputChange} placeholder="Blog Title" className="mb-4"/>
      <Textarea name="blogContent" value={formData.blogContent} onChange={handleInputChange} placeholder="Blog Content (HTML allowed)" className="mb-4"/>
      <Input name="coverPhoto" value={formData.coverPhoto} onChange={handleInputChange} placeholder="Cover Photo URL" className="mb-4"/>
      <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" className="mb-4"/>
      <h3>Work Experiences</h3>
      {formData.workExperiences.map((exp, index) => (
        <div key={index} className="mb-2">
          <Input value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} placeholder="Role"/>
          <Textarea value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} placeholder="Description"/>
          <Button onClick={() => removeExperience(index)}>Remove</Button>
        </div>
      ))}
      <Button onClick={addExperience}>Add Experience</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      {currentPage === 'About' && <AboutPage />}
      {currentPage === 'Blog' && <BlogPage />}
      {currentPage === 'Contact' && <ContactPage />}
      {currentPage === 'Form' && <FormPage />}
      {!currentPage && <BlogPage />} {/* Default to Blog page */}
    </div>
  );
}

export default App;