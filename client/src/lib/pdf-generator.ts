import jsPDF from 'jspdf';
import type { UpgradePlan } from '@shared/schema';

export function generatePlanPDF(plan: UpgradePlan): void {
  const doc = new jsPDF();
  const steps = plan.steps as any[];
  
  // Title
  doc.setFontSize(20);
  doc.text(plan.title, 20, 30);
  
  // Description
  doc.setFontSize(12);
  doc.text(plan.description || '', 20, 50);
  
  // Plan details
  doc.setFontSize(14);
  doc.text('Plan Details', 20, 70);
  
  doc.setFontSize(10);
  doc.text(`Status: ${plan.status}`, 20, 85);
  doc.text(`Priority: ${plan.priority}`, 20, 95);
  doc.text(`Estimated Duration: ${plan.estimatedDuration}`, 20, 105);
  doc.text(`Progress: ${plan.progress}%`, 20, 115);
  
  // Steps
  doc.setFontSize(14);
  doc.text('Implementation Steps', 20, 135);
  
  let yPosition = 150;
  steps.forEach((step, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${step.title}`, 20, yPosition);
    
    doc.setFontSize(10);
    doc.text(`   ${step.description}`, 20, yPosition + 10);
    doc.text(`   Category: ${step.category} | Time: ${step.estimatedTime}`, 20, yPosition + 20);
    doc.text(`   Status: ${step.completed ? 'Completed' : 'Pending'}`, 20, yPosition + 30);
    
    yPosition += 45;
  });
  
  // Save the PDF
  doc.save(`${plan.title.replace(/\s+/g, '_')}.pdf`);
}
