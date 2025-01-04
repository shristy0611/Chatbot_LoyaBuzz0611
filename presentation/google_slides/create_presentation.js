function createLoyaBuzzPresentation() {
  // Create a new presentation
  var presentation = SlidesApp.create('LoyaBuzz AI Assistant - PoC Presentation');
  
  // Set the theme colors
  var theme = {
    primary: '#2c3e50',
    secondary: '#3498db',
    accent: '#2ecc71',
    text: '#333333',
    background: '#ffffff'
  };
  
  // Title Slide
  var titleSlide = presentation.getSlides()[0];
  titleSlide.getBackground().setSolidFill(theme.primary);
  
  var titleShape = titleSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 100, 600, 50);
  var titleTextRange = titleShape.getText();
  titleTextRange.setText('LoyaBuzz AI Assistant');
  titleTextRange.getTextStyle().setForegroundColor('#ffffff').setFontSize(44).setBold(true);
  
  var subtitleShape = titleSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 160, 600, 50);
  subtitleShape.getText().setText('Intelligent Customer Support Solution').getTextStyle().setForegroundColor('#ecf0f1').setFontSize(28);
  
  // Overview Slide
  var overviewSlide = presentation.appendSlide();
  var overviewTitle = overviewSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 20, 600, 50);
  overviewTitle.getText().setText('Project Overview').getTextStyle().setForegroundColor(theme.primary).setFontSize(36).setBold(true);
  
  var overviewPoints = [
    '• Current State: Manual Support',
    '• PoC Phase: Chrome Extension & Landing Page',
    '• Future: Full Website Integration'
  ];
  
  var pointsShape = overviewSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 100, 600, 200);
  pointsShape.getText().setText(overviewPoints.join('\\n')).getTextStyle().setFontSize(24);
  
  // Implementation Phases Slide
  var phasesSlide = presentation.appendSlide();
  var phasesTitle = phasesSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 20, 600, 50);
  phasesTitle.getText().setText('Implementation Phases').getTextStyle().setForegroundColor(theme.primary).setFontSize(36).setBold(true);
  
  // Left column
  var leftColumn = phasesSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 100, 280, 300);
  leftColumn.getText().setText('Phase 1: PoC\\n\\n• Chrome extension\\n• Landing page integration\\n• Basic AI training')
    .getTextStyle().setFontSize(20);
  
  // Right column
  var rightColumn = phasesSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 360, 100, 280, 300);
  rightColumn.getText().setText('Phase 2: Integration\\n\\n• Website embedding\\n• Enhanced AI model\\n• Full feature set')
    .getTextStyle().setFontSize(20);
  
  // Investment & ROI Slide
  var roiSlide = presentation.appendSlide();
  var roiTitle = roiSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 20, 600, 50);
  roiTitle.getText().setText('Investment & ROI').getTextStyle().setForegroundColor(theme.primary).setFontSize(36).setBold(true);
  
  var investmentBox = roiSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 100, 600, 200);
  investmentBox.getText().setText(
    'Investment:\\n' +
    '• PoC Development: 1500-2000 CAD\\n' +
    '• Timeline: 2-3 weeks\\n\\n' +
    'Returns:\\n' +
    '• 24/7 Customer Support\\n' +
    '• Reduced Support Costs\\n' +
    '• Improved Customer Satisfaction'
  ).getTextStyle().setFontSize(20);
  
  // Next Steps Slide
  var nextStepsSlide = presentation.appendSlide();
  var nextStepsTitle = nextStepsSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 20, 600, 50);
  nextStepsTitle.getText().setText('Next Steps').getTextStyle().setForegroundColor(theme.primary).setFontSize(36).setBold(true);
  
  var steps = [
    '1. Agreement Finalization',
    '2. Data Collection',
    '3. Development Kickoff',
    '4. Testing & Refinement',
    '5. Deployment'
  ];
  
  var stepsBox = nextStepsSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 100, 600, 200);
  stepsBox.getText().setText(steps.join('\\n')).getTextStyle().setFontSize(24);
  
  // Return the presentation URL
  return presentation.getUrl();
} 