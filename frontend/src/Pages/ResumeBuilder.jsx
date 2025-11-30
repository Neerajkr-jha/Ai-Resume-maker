import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillForm from "../components/SkillForm";

function ResumeBuilder() {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  // Progress bar states
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "project", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  // Load resume on mount
  useEffect(() => {
    const resume = dummyResumeData.find((r) => r._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title;
    }
  }, [resumeId]);

  //make public / private
  const chnageResumeVisibility= async()=>{
    setResumeData({...resumeData,public:!resumeData.public})
  }
  //sharing resume
  const handleShare=()=>{
    const frontendUrl=window.location.href.split('/app/')[0];
    const resumeUrl=frontendUrl+'/view/'+resumeId;
    if(navigator.share){
      navigator.share({url:resumeUrl,text:'My Resume', });
    }else{
      alert('Share not suported in this browser')
    }
  }
  // download
  const downloadResume=()=>{
    window.print();
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left panel */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-green-200 pt-1 p-6">

              {/* Progress bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />

              <hr
                className="absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none transition-all duration-700"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />
               {/* section Navigation */}
               <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({...prev, template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=> setResumeData(prev => ({...prev ,accent_color:color}))}/>
                </div>

                {/* next and previous logic */}
                
                <div className="flex items-center">
                  {activeSectionIndex !==0 && (
                    <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.max(prevIndex-1,0))} className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all" disabled={activeSectionIndex==0}>
                      <ChevronLeft className="size-4"/>
                      Previous
                    </button>
                  )}
                   <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.min(prevIndex+1,sections.length-1))} className={`flex items-center gap-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length-1 && `opacity-50`}`} disabled={activeSectionIndex === sections.length-1}>
                    Next
                      <ChevronRight className="size-4"/>
                    </button>
                </div>
               </div>
               {/* form content */}
               <div className="space-y-6">
                {/* for personal information */}
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev=>({...prev,personal_info:data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                )}
                {/* for professional summary */}
                {activeSection.id === 'summary' && (
                  <div>
                    <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev=>({...prev,professional_summary:data}))} setResumeData={setResumeData}/>
                  </div>
                )}
                {activeSection.id === 'experience' && (
                  <div>
                    <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev=>({...prev,experience:data}))}/>
                  </div>
                )}
                {activeSection.id === 'education' && (
                  <div>
                    <EducationForm data={resumeData.education} onChange={(data)=>setResumeData(prev=>({...prev,education:data}))}/>
                  </div>
                )}
                {activeSection.id === 'project' && (
                  <div>
                    <ProjectForm data={resumeData.project} onChange={(data)=>setResumeData(prev=>({...prev,project:data}))}/>
                  </div>
                )}
                {activeSection.id === 'skills' && (
                  <div>
                    <SkillForm data={resumeData.skills} onChange={(data)=>setResumeData(prev=>({...prev,skills:data}))}/>
                  </div>
                )}
               </div>
               <button className='bg-linear-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes
               </button>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-7 max-lg:mt-6">
            {/* ------top buttons------ */}
            <div className="relative w-full">
              <div className="absolute bottom-3 right-0 left-0 flex items-center gap-2 justify-end">
                {resumeData.public && 
                (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl ring-blue-300 hover:ring transition-colors border hover:border-blue-600'>
                    <Share2 className="size-4"/>
                    <span>Share</span>
                  </button>
                )}
                <button onClick={chnageResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-purple-100 to-purple-200 text-purple-600 rounded-xl ring-purple-300 hover:ring transition-colors border hover:border-purple-600'>
                  {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                  {resumeData.public ? 'Public': 'Private'}
                </button>
                <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-green-100 to-green-200 text-green-600 rounded-xl ring-green-300 hover:ring transition-color border hover:border-green-600'>
                  <DownloadIcon  className="size-4"/>
                </button>
              </div>
            </div>
              {/* --- resume-preview --- */}
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
