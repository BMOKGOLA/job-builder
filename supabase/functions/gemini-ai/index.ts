import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
    
    let prompt = ''
    let systemInstruction = ''

    switch (action) {
      case 'generateContentSuggestions':
        systemInstruction = 'You are an expert resume writer and career coach. Provide specific, actionable content suggestions that improve ATS compatibility and highlight achievements.'
        prompt = `Analyze this resume data for ${payload.targetIndustry} industry and suggest improvements:

Resume Data: ${JSON.stringify(payload.resumeData, null, 2)}

${payload.jobDescription ? `Job Description: ${payload.jobDescription}` : ''}

Provide specific suggestions for:
1. Professional summary enhancement with industry keywords
2. Work experience bullet points that highlight achievements with metrics
3. Skills optimization for ATS scanning

Format response as JSON array of suggestion objects with: section, original, suggested, reason, keywords, confidence`
        break;

      case 'analyzeATSCompatibility':
        systemInstruction = 'You are an ATS (Applicant Tracking System) expert. Analyze resume compatibility and provide a detailed score with specific issues and fixes.'
        prompt = `Analyze this resume for ATS compatibility:

${JSON.stringify(payload.resumeData, null, 2)}

Provide analysis including:
1. Overall ATS score (0-100)
2. Critical issues that prevent parsing
3. Warning issues that reduce ranking
4. Keyword density analysis
5. Format issues

Format response as JSON object with: score, issues (array), keywordMatches (array), formatIssues (array)`
        break;

      case 'analyzeJobMatch':
        systemInstruction = 'You are a job matching expert. Analyze how well a resume matches a specific job description.'
        prompt = `Compare this resume against the job description:

Resume: ${JSON.stringify(payload.resumeData, null, 2)}

Job Description: ${payload.jobDescription}

Provide:
1. Match percentage (0-100)
2. Missing keywords from job description
3. Overused keywords that seem forced
4. Specific suggestions to improve match

Format response as JSON object with: matchScore, missingKeywords (array), overusedKeywords (array), suggestions (array)`
        break;

      case 'generateSmartSuggestions':
        systemInstruction = 'You are a writing coach specializing in professional resume content.'
        prompt = `Provide smart writing suggestions for the ${payload.section} section:

Current Content: ${payload.currentContent}
Context: ${JSON.stringify(payload.context)}

Provide 3-5 specific, actionable suggestions to improve this section.
Format response as JSON array of strings.`
        break;

      default:
        throw new Error('Invalid action')
    }

    const response = await fetch(`${baseUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        systemInstruction: {
          parts: [{
            text: systemInstruction
          }]
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error('No response generated')
    }

    // Try to parse JSON response
    let result
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      result = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse JSON:', generatedText)
      // Fallback for non-JSON responses
      result = { text: generatedText }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})