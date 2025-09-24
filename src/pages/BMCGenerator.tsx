import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Lightbulb } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useStore } from '../store/useStore';
import jsPDF from 'jspdf';

const bmcBlocks = [
  { key: 'keyPartners', title: 'Key Partners', description: 'Who are your key partners and suppliers?' },
  { key: 'keyActivities', title: 'Key Activities', description: 'What key activities does your value proposition require?' },
  { key: 'keyResources', title: 'Key Resources', description: 'What key resources does your value proposition require?' },
  { key: 'valueProposition', title: 'Value Proposition', description: 'What value do you deliver to customers?' },
  { key: 'customerRelationships', title: 'Customer Relationships', description: 'What type of relationship do you establish?' },
  { key: 'channels', title: 'Channels', description: 'Through which channels do you reach customers?' },
  { key: 'customerSegments', title: 'Customer Segments', description: 'For whom are you creating value?' },
  { key: 'costStructure', title: 'Cost Structure', description: 'What are the most important costs?' },
  { key: 'revenueStreams', title: 'Revenue Streams', description: 'For what value are customers willing to pay?' },
];

const generateMockBMC = (ideaTitle: string, ideaDescription: string) => {
  return {
    keyPartners: 'Technology providers, strategic advisors, key suppliers, distribution partners',
    keyActivities: 'Platform development, customer acquisition, content creation, data analysis',
    keyResources: 'Technical team, intellectual property, brand, customer data',
    valueProposition: `${ideaTitle} - Solving key problems for customers through innovative solutions`,
    customerRelationships: 'Personal assistance, self-service platform, community building',
    channels: 'Digital marketing, direct sales, partnerships, social media',
    customerSegments: 'Early adopters, tech-savvy users, businesses seeking efficiency',
    costStructure: 'Development costs, marketing expenses, operational overhead, talent acquisition',
    revenueStreams: 'Subscription fees, transaction fees, premium features, partnerships',
  };
};

export const BMCGenerator: React.FC = () => {
  const { ideas, updateIdea } = useStore();
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [bmcData, setBmcData] = useState<Record<string, string>>({});
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateBMC = () => {
    const selectedIdea = ideas.find(idea => idea.id === selectedIdeaId);
    if (!selectedIdea) return;

    const generatedBMC = generateMockBMC(selectedIdea.title, selectedIdea.description);
    setBmcData(generatedBMC);
    setIsGenerated(true);
    
    // Mark BMC as generated for this idea
    updateIdea(selectedIdeaId, { bmcGenerated: true });
  };

  const handleUpdateBlock = (key: string, value: string) => {
    setBmcData({ ...bmcData, [key]: value });
  };

  const exportToPDF = () => {
    const selectedIdea = ideas.find(idea => idea.id === selectedIdeaId);
    if (!selectedIdea) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.text('Business Model Canvas', margin, yPosition);
    yPosition += 15;

    // Idea title
    pdf.setFontSize(16);
    pdf.text(selectedIdea.title, margin, yPosition);
    yPosition += 20;

    // BMC blocks
    pdf.setFontSize(12);
    bmcBlocks.forEach((block) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFont(undefined, 'bold');
      pdf.text(block.title, margin, yPosition);
      yPosition += 8;

      pdf.setFont(undefined, 'normal');
      const lines = pdf.splitTextToSize(bmcData[block.key] || '', pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * 6 + 10;
    });

    pdf.save(`${selectedIdea.title}-BMC.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Model Canvas Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate a comprehensive Business Model Canvas for your startup idea. 
          Our AI will auto-populate the 9 essential blocks based on your idea description.
        </p>
      </motion.div>

      {/* Idea Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select an Idea</h2>
        {ideas.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No ideas found. Please add an idea first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <select
              value={selectedIdeaId}
              onChange={(e) => setSelectedIdeaId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select an idea...</option>
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id}>
                  {idea.title}
                </option>
              ))}
            </select>
            
            {selectedIdeaId && (
              <div className="flex space-x-4">
                <Button
                  onClick={handleGenerateBMC}
                  icon={FileText}
                  disabled={!selectedIdeaId}
                >
                  Generate BMC
                </Button>
                {isGenerated && (
                  <Button
                    onClick={exportToPDF}
                    variant="outline"
                    icon={Download}
                  >
                    Export PDF
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* BMC Canvas */}
      {isGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Model Canvas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bmcBlocks.map((block, index) => (
              <motion.div
                key={block.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`border-2 border-gray-200 rounded-lg p-4 ${
                  block.key === 'valueProposition' ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <h3 className="font-semibold text-primary-900 mb-2">{block.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{block.description}</p>
                <textarea
                  value={bmcData[block.key] || ''}
                  onChange={(e) => handleUpdateBlock(block.key, e.target.value)}
                  className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Click to edit..."
                />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={exportToPDF}
              icon={Download}
              size="lg"
            >
              Export Business Model Canvas
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
