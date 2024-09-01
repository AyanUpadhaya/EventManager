const testOne = (req,res)=>{
    res.status(200).json({message:"I got your message"})
}

module.exports = {
  testOne,
};