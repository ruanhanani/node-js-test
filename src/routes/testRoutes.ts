import { Router, Request, Response } from 'express';
import axios from 'axios';
import https from 'https';

const router = Router();

// Configure axios to bypass SSL certificate issues in corporate environments
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Bypass self-signed certificate issues
});

axios.defaults.httpsAgent = httpsAgent;

/**
 * Direct GitHub API test endpoint
 */
router.get('/github/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    console.log(`🧪 [TestAPI] Direct GitHub API test for username: ${username}`);
    
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
      params: {
        per_page: 5,
        sort: 'updated',
        direction: 'desc',
        type: 'public',
      },
      timeout: 15000,
      headers: {
        'User-Agent': 'Node.js-Test-API/1.0',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    console.log(`✅ [TestAPI] Success! Status: ${response.status}, Repos: ${response.data.length}`);
    
    const repos = response.data.map((repo: any) => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
    }));

    res.status(200).json({
      success: true,
      message: `🎉 GitHub API test for ${username} SUCCESSFUL!`,
      data: {
        username,
        repositories: repos,
        total: repos.length,
        rateLimit: {
          limit: response.headers['x-ratelimit-limit'],
          remaining: response.headers['x-ratelimit-remaining'],
          reset: new Date(parseInt(response.headers['x-ratelimit-reset']) * 1000).toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`❌ [TestAPI] Error:`, error.message);
    
    res.status(500).json({
      success: false,
      message: 'GitHub API test FAILED',
      error: {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
