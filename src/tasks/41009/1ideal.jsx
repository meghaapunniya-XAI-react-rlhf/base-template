import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BlogForm = ({ onSubmit }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [workExperiences, setWorkExperiences] = useState([]);
    const [currentExperience, setCurrentExperience] = useState({ role: "", description: "" });
    const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            email,
            phone,
            location,
            blogTitle,
            blogContent,
            workExperiences,
            coverPhotoUrl,
        });
    };

    const addWorkExperience = () => {
        if (currentExperience.role.trim() && currentExperience.description.trim()) {
            setWorkExperiences([...workExperiences, currentExperience]);
            setCurrentExperience({ role: "", description: "" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input
                type="phone"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
            />
            <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
            />
            <Input
                placeholder="Blog Title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                required
            />
            <Textarea
                placeholder="Blog Content (You can include text, image links, and video links)"
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                required
            />
            <Input
                placeholder="Cover Photo URL"
                value={coverPhotoUrl}
                onChange={(e) => setCoverPhotoUrl(e.target.value)}
            />
            <div className="space-y-2">
                <Input
                    placeholder="Work Experience Role"
                    value={currentExperience.role}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, role: e.target.value })}
                />
                <Textarea
                    placeholder="Work Experience Description"
                    value={currentExperience.description}
                    onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                />
                <Button type="button" onClick={addWorkExperience}>
                    Add Work Experience
                </Button>
            </div>
            <ul className="list-disc pl-5">
                {workExperiences.map((exp, index) => (
                    <li key={index}>{exp.role}: {exp.description}</li>
                ))}
            </ul>
            <Button type="submit">Create Blog</Button>
        </form>
    );
};

const Navbar = ({ activeTab, setActiveTab }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = ["Blog", "About", "Contact"];

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">My Blog</div>
                <div className="hidden sm:flex space-x-4">
                    {navItems.map((item) => (
                        <Button
                            key={item}
                            variant={activeTab === item ? "default" : "ghost"}
                            onClick={() => setActiveTab(item)}
                            className="text-white"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
                <div className="sm:hidden">
                    <Button className='hover:bg-white hover:text-black' onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <>X</>
                        ) : (
                            <>Menu</>
                        )}
                    </Button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="sm:hidden mt-2">
                    {navItems.map((item) => (
                        <Button
                            key={item}
                            variant={activeTab === item ? "default" : "ghost"}
                            onClick={() => {
                                setActiveTab(item);
                                setIsMenuOpen(false);
                            }}
                            className="block w-full text-left text-white mb-2"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            )}
        </nav>
    );
};

const BlogContent = ({ content }) => {
    const renderContent = (text) => {
        return text.split('\n').map((paragraph, index) => {
            const parts = paragraph.split(/(\S+:\/\/\S+)/);
            return (
                <p key={index}>
                    {parts.map((part, partIndex) => {
                        if (part.match(/^https?:\/\//)) {
                            if (part.match(/(\.(jpg|jpeg|png|gif)$|\=(jpg|jpeg|png|gif)$)/i)) {
                                return <img key={partIndex} src={part} alt="Blog content" className="mx-auto my-5 max-w-[90%] h-auto" />;
                            } else if (part.match(/(?:youtube\.com\/(?:.*v=|v\/|.*\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)) {
                                const videoId = part.match(/(?:youtube\.com\/(?:.*v=|v\/|.*\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1];
                                return (
                                    <iframe
                                        key={partIndex}
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="mx-auto my-5 w-[90%] h-auto"
                                    ></iframe>
                                );
                            }
                            return (
                                <a key={partIndex} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {part}
                                </a>
                            );
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return <div className="prose max-w-none">{renderContent(content)}</div>;
};

const TimelineItem = ({ experience }) => (
    <div className="mb-8 flex justify-between items-center w-full">
        <div className="order-1 w-5/12"></div>
        <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-9 h-8 mx-auto rounded-full">
            <h1 className="mx-auto font-semibold text-lg text-white">•</h1>
        </div>
        <div className="order-1 bg-gray-100 rounded-lg w-6/12 px-6 py-4">
            <h3 className="font-bold text-gray-800 mb-2">{experience.role}</h3>
            <p className="text-sm leading-snug tracking-wide text-gray-900">{experience.description}</p>
        </div>
    </div>
);

const FlipCard = ({ frontContent, backContent, onClick }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div
            className="flip-card w-64 h-64 perspective-1000 mx-auto"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="absolute w-full h-full backface-hidden ">
                    {frontContent}
                </div>
                <div
                    className="absolute w-full h-full backface-hidden rotate-y-180 rounded-md bg-red-400"
                    onClick={onClick}
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    {backContent}
                </div>
            </div>
            <style jsx='true'>{`
          .flip-card {
            perspective: 1000px;
          }

          .backface-hidden {
            backface-visibility: hidden;
          }

          .rotate-y-180 {
            transform: rotateY(180deg);
          }
        `}</style>
        </div>
    );
};

const App = () => {
    const [blogData, setBlogData] = useState(null);
    const [activeTab, setActiveTab] = useState("Blog");
    const [showForm, setShowForm] = useState(true);

    const handleSubmit = (data) => {
        setBlogData(data);
        setActiveTab("Blog");
        setShowForm(false);
    };

    const renderContent = () => {
        if (showForm) {
            return (
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Create Your Blog</h1>
                    <BlogForm onSubmit={handleSubmit} />
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gray-100 bg-opacity-50" style={{ backgroundImage: `url('/api/placeholder/1920/1080')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="container mx-auto p-4">
                    <Button
                        variant="outline"
                        className="mb-4"
                        onClick={() => setShowForm(true)}
                    >
                        Back to Form
                    </Button>
                    {activeTab === "Blog" && (
                        <Card className='bg-gray-200'>
                            <CardHeader>
                                <CardTitle className='text-center'>{blogData.blogTitle}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BlogContent content={blogData.blogContent} />
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === "About" && (
                        <div className="space-y-8">
                            <div className="flex justify-center">
                                <FlipCard
                                    frontContent={
                                        <div className="w-full h-full rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${blogData.coverPhotoUrl || '/api/placeholder/400/400'})` }}></div>
                                    }
                                    backContent={
                                        <div className="w-full h-full rounded-md bg-gray-800 text-white p-4 flex flex-col justify-center items-center text-center">
                                            <h2 className="text-xl font-bold mb-2">{blogData.name}</h2>
                                            <p className="mb-4">{blogData.workExperiences[blogData.workExperiences.length - 1]?.role}</p>
                                            <Button className='bg-gray-300 text-black hover:bg-gray-400 hover:text-white' onClick={() => setActiveTab("Contact")}>Contact Me for Collaboration!</Button>
                                        </div>
                                    }
                                    onClick={() => setActiveTab("Contact")}
                                />
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Work Experience</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="container mx-auto w-full h-full">
                                        <div className="relative wrap overflow-hidden p-10 h-full">
                                            <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-1/2"></div>
                                            {blogData.workExperiences.map((exp, index) => (
                                                <TimelineItem key={index} experience={exp} />
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {activeTab === "Contact" && (
                        <Card className='w-[90%] h-auto mx-auto bg-gray-200'>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Email:</strong> {blogData.email}</p>
                                <p><strong>Phone:</strong> {blogData.phone}</p>
                                <p><strong>Location:</strong> {blogData.location}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        );
    };

    return renderContent();
};

export default App;