const Input = ({ text, setText }) => {
    return (
        <input
            type='text'
            value={text}
            className='flex w-full min-h-[60px] p-1 rounded-md border border-stone-300 border-input text-md shadow-sms placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            onChange={e => setText(e.target.value)}
            placeholder='Digite uma mensagem'
        />
    );
};

export default Input;
