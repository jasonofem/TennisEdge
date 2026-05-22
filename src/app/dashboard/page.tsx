const fetchLiveData = async () => {
  setLoading(true);
  const apiKey = localStorage.getItem("odds_api_key");
  
  if (!apiKey) {
    setApiStatus({ 
      connected: false, 
      message: "No API key configured",
      error: "Go to Settings and add your API key" 
    });
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`/api/live-tennis?key=${apiKey}`);
    const data = await response.json();
    
    if (data.success && data.matches?.length > 0) {
      setMatches(data.matches);
      setApiStatus({ 
        connected: true, 
        message: `${data.totalMatches} matches loaded`,
        error: "" 
      });
    } else {
      setApiStatus({ 
        connected: false, 
        message: data.error || "No matches",
        error: data.details || ""
      });
    }
    setLastUpdate(new Date());
  } catch (error: any) {
    setApiStatus({ 
      connected: false, 
      message: "Connection failed",
      error: error.message 
    });
  }
  setLoading(false);
};
