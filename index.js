import Queue from "bull";
import express from 'express'
import Arena from 'bull-arena'
import Bull from 'bull';

const app = express()
const port = 3001

const router = express.Router();

const arenaConfig = Arena({
  Bull,
  queues: [
    {
      type: 'bull',

      // Name of the bull queue, this name must match up exactly with what you've defined in bull.
      name: "myQueue",

      // Hostname or queue prefix, you can put whatever you want.
      hostId: "MyAwesomeQueues",

      // Redis auth.
      redis: {
      },
    },
  ],
})


router.use('/arena', arenaConfig)


app.use(router)
// app.use(arenaConfig)


app.get('/a', (req, res) => {

  const queue = new Queue("myQueue");

  const main = async () => {
    await queue.add({ name: "John", age: 30 });
  };

  queue.process((job, done) => {
    console.log(job.data);
    done();
  });

  console.log('myQueue was created successfully')

  main().catch(console.error);

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


