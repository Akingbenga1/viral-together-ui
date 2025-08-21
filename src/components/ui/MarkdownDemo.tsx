import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const MarkdownDemo: React.FC = () => {
  const sampleMarkdown = `# AI Enhancement Example

This is an **AI-enhanced recommendation** for your influencer strategy.

## Key Strategies

### Content Optimization
- Focus on **high-engagement** content types
- Use trending hashtags strategically
- Implement consistent posting schedule

### Growth Tactics
1. Collaborate with complementary influencers
2. Cross-promote on multiple platforms
3. Use user-generated content campaigns

### Performance Metrics
\`\`\`
Engagement Rate: 3.2% → Target: 5%
Follower Growth: 15% monthly
Content Consistency: 70% → Target: 85%
\`\`\`

For more information, visit [our guide](https://example.com/guide).

*This recommendation is based on your current performance and industry best practices.*`;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Markdown Rendering Demo</h2>
      <div className="border-t pt-4">
        <MarkdownRenderer content={sampleMarkdown} />
      </div>
    </div>
  );
};

export default MarkdownDemo;
