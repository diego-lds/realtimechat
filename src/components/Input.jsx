const Input = ({ text, handleOnChange }) => {
    return (
        <input
            type='text'
            value={text}
            className='w-full  p-1 rounded-md border border-stone-300 border-input placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            onChange={e => handleOnChange(e)}
            placeholder='Digite uma mensagem'
        />
    );
};

export default Input;
