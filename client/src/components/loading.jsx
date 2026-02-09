//Import React and css
import '../assets/styles/loading.css';

const Loading = () => {
  return (
    <div className = 'img_container'>
      <div className = 'img_center'>
        <div className = 'cycle_loading'/>
        <div className = 'loading' />
      </div>
    </div>
  );
};

export default Loading;