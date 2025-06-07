import React, { createContext, useContext, useReducer } from 'react';

export interface Project {
  id: string;
  name: string;
  details: string;
  createdAt: string;
}

interface ProjectsState {
  projects: Project[];
}

type ProjectsAction = 
  | { type: 'ADD_PROJECT'; payload: Omit<Project, 'id' | 'createdAt'> }
  | { type: 'EDIT_PROJECT'; payload: { id: string; name: string; details: string } }
  | { type: 'DELETE_PROJECT'; payload: string };  // Changed payload type to just string

interface ProjectsContextType {
  state: ProjectsState;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  editProject: (id: string, name: string, details: string) => void;
  deleteProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const projectsReducer = (state: ProjectsState, action: ProjectsAction): ProjectsState => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects,
          {
            id: Date.now().toString(),
            name: action.payload.name,
            details: action.payload.details,
            createdAt: new Date().toISOString()
          }
        ]
      };
    
    case 'EDIT_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === action.payload.id 
            ? { ...project, name: action.payload.name, details: action.payload.details }
            : project
        )
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)  // Changed to use direct string comparison
      };
    
    default:
      return state;
  }
};

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectsReducer, { projects: [] });
  
  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };
  
  const editProject = (id: string, name: string, details: string) => {
    dispatch({ type: 'EDIT_PROJECT', payload: { id, name, details } });
  };
  
  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });  // Changed to pass just the id
  };
  
  return (
    <ProjectsContext.Provider value={{ state, addProject, editProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};