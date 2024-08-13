import dynamic from 'next/dynamic';
import React from 'react';
import 'react-quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ size: [] }, { font: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const formats = [
  'size',
  'font',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'align',
  'link',
  'image',
  'video',
  'iframe',
];

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const convertClassToClassName = (html: string) => {
  html = html.replace(/<iframe class="ql-video ql-align-center"/g, '<div class="center"><iframe class="ql-video ql-align-center" ');
  html = html.replace(/<iframe class="ql-video ql-align-right"/g, '<div class="end"><iframe class="ql-video ql-align-right" ');

  html = html.replace(/<\/iframe>/g, '</iframe></div>');

   

  return html;
};

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const handleBeforeChange = (content: string, delta: any, source: string) => {
    if (source === 'user') {
      // Apply custom transformations here
      const transformedContent = convertClassToClassName(content);
      onChange(transformedContent);
    }
  };

  return (
    <div className="editorContainer">
      <QuillNoSSRWrapper
        value={value}
        onChange={handleBeforeChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
};

export default TextEditor;
