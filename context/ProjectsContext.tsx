<<<<<<< HEAD
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
=======
import React, { createContext, useContext, useReducer } from 'react';
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1

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
<<<<<<< HEAD
  | { type: 'LOAD_PROJECTS'; payload: Project[] }
=======
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
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
<<<<<<< HEAD
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.payload };
=======
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
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
<<<<<<< HEAD

  // Load projects from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('projects');
        if (stored) {
          dispatch({ type: 'LOAD_PROJECTS', payload: JSON.parse(stored) });
        }
      } catch (e) {
        console.error('Failed to load projects', e);
      }
    })();
  }, []);

  // Save projects to AsyncStorage on every change
  useEffect(() => {
    AsyncStorage.setItem('projects', JSON.stringify(state.projects));
  }, [state.projects]);

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const editProject = (id: string, name: string, details: string) => {
    dispatch({ type: 'EDIT_PROJECT', payload: { id, name, details } });
  };

  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

=======
  
  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };
  
  const editProject = (id: string, name: string, details: string) => {
    dispatch({ type: 'EDIT_PROJECT', payload: { id, name, details } });
  };
  
  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });  // Changed to pass just the id
  };
  
>>>>>>> f628cf64b8a50cf27ecbf0e5815e5afcd4c080b1
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