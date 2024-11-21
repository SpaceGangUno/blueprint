// Previous imports remain the same...

export default function ProjectDetails() {
  // Previous state declarations remain the same...

  const toggleSubTaskExpansion = (subTaskId: string) => {
    setExpandedSubTasks(prev =>
      prev.includes(subTaskId)
        ? prev.filter(id => id !== subTaskId)
        : [...prev, subTaskId]
    );
  };

  // Rest of the component remains the same...
}
