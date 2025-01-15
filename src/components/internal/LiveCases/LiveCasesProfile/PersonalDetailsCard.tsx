import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface PersonalDetailsProps {
  patientName: string;
  patientAge: string;
  patientGender: string;
  phoneNumber1: string;
  emtNotes: { image: string[], note: string }[];
}

const PersonalDetailsCard = ({
  patientName,
  patientAge,
  patientGender,
  phoneNumber1,
  emtNotes
}: PersonalDetailsProps) => {
  return (
    <Card className="p-6 border border-gray-200 shadow-md flex flex-col">
      <div className="flex items-center gap-4">
        <div className="flex flex-col space-y-2">
          <div>
            <Label>Patient Name</Label>
            <p className="text-sm text-[#013DC0]">{patientName || 'N/A'}</p>
          </div>
          <div>
            <Label>Age</Label>
            <p className="text-sm text-[#013DC0]">{patientAge || 'N/A'}</p>
          </div>
          <div>
            <Label>Gender</Label>
            <p className="text-sm text-[#013DC0]">{patientGender || 'N/A'}</p>
          </div>
          <div>
            <Label>Phone Number</Label>
            <p className="text-sm text-[#013DC0]">{phoneNumber1 || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className='flex flex-row items-center justify-between mt-2'>

        {/* Notes Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary" className='w-36 font-normal'>Notes</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-[#E9F4FF] rounded-xl">
            <DialogHeader>
              <DialogDescription className='mt-5'>
                {emtNotes.map((note, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-sm">{note.note}</p>
                  </div>
                ))}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* View Images Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary" className='w-36 font-normal'>View Images</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#E9F4FF] rounded-xl">
            <DialogHeader>
              <DialogDescription>
                {emtNotes.map((note, index) => (
                  <div key={index} className="mb-4">
                    {note.image.length > 0 && (
                      <div>
                        <p className="text-sm">Images:</p>
                        <div className="grid grid-cols-3 gap-4"> {/* Grid with 3 images per row */}
                          {note.image.map((img, imgIndex) => (
                            <div key={imgIndex} className="flex justify-center">
                              <img
                                src={img}
                                alt={`Image ${imgIndex + 1}`}
                                className="w-96 h-40 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

export default PersonalDetailsCard;
